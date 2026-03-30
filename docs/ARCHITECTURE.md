# ARC Architecture and Data Flow

## Overview

The `adaptive-replacement-cache` library implements the Adaptive Replacement Cache (ARC) algorithm, which adaptively balances between recently accessed and frequently accessed items to maximize cache hit rates.

## Architecture

### Core Components

```mermaid
classDiagram
    class ARC {
        -#size: number
        +cache: Map
        +b1: Map
        +b2: Map
        +t1: Map
        +t2: Map
        +constructor(size)
        +get(key)
        +set(key, value)
        +delete(key)
        +has(key)
        +clear()
        +size: number
        +maxSize: number
        +keys()
        +values()
        +entries()
        +forEach(callback)
        +toJSON()
        +adjust()
    }

    class CacheEntry {
        +key: string|number
        +value: any
    }

    ARC --> "1" CacheEntry : manages
```

### Internal Data Structures

The ARC implementation maintains 5 maps:

| Map | Purpose | Contents |
|-----|---------|----------|
| `cache` | Main storage | All cached key-value pairs |
| `b1` | Recently accessed (transient) | Keys accessed once, recently |
| `b2` | Frequently accessed (stable) | Keys accessed multiple times |
| `t1` | Recently evicted (transient) | Keys evicted from b1 |
| `t2` | Frequently evicted (stable) | Keys evicted from b2 |

## Data Flow

### Retrieval Flow get

```mermaid
sequenceDiagram
    participant Client
    participant Cache as get

    Client->>Cache: get key
    Cache->>Cache: Check cache.has key
    alt Not Found
        Cache-->>Client: undefined
    else Found
        Cache->>Cache: Check which list
        alt In b1
            Cache->>Cache: Move to b2
            Cache->>Cache: Call adjust
        else In b2
            Cache->>Cache: Keep in b2
        else In t1
            Cache->>Cache: Move to t2
            Cache->>Cache: Call adjust
        else In t2
            Cache->>Cache: Keep in t2
        end
        Cache-->>Client: Return value
    end
```

### Insertion Flow set

```mermaid
sequenceDiagram
    participant Client
    participant Cache as set

    Client->>Cache: set key value
    Cache->>Cache: Check cache.has key
    alt Key Exists
        Cache->>Cache: Update value
        Cache->>Cache: Call get to update position
        Cache-->>Client: Done
    else Key New
        Cache->>Cache: Check cache.size >= maxSize
        loop While over capacity
            Cache->>Cache: Find oldest key
            Cache->>Cache: Remove from all lists
            Cache->>Cache: Delete from cache
        end
        Cache->>Cache: Add to cache
        Cache->>Cache: Add to b1
        Cache->>Cache: Call adjust
        Cache-->>Client: Done
    end
```

## The adjust Method

The adjust method maintains balance between the four tracking lists based on access patterns.

### Algorithm

1. Calculate `delta = max(b1.size - b2.size, 0) / 2`
2. Calculate targetb1Size floor max maxSize delta div 2
3. Move excess from b1 to t1 until b1 <= targetb1Size
4. Calculate targetb2Size = maxSize - targetb1Size
5. Move excess from b2 to t2 until b2 <= targetb2Size

### Visual Representation

```mermaid
flowchart TD
    A[adjust called] --> B[Calculate delta]
    B --> C[Calculate targetb1Size]
    C --> D[Move from b1 to t1]
    D --> E[Calculate targetb2Size]
    E --> F[Move from b2 to t2]
    F --> G[Balance achieved]

    subgraph Lists
        b1[b1 transient recently accessed]
        b2[b2 stable frequently accessed]
        T1[t1 recently evicted]
        T2[t2 frequently evicted]
        C[cache all entries]
        
        b1 --> C
        b2 --> C
        T1 --> C
        T2 --> C
    end
```

## Eviction Strategy

When the cache is at capacity and a new item is inserted:

1. **Loop while `cache.size >= maxSize`**:
    - Try to evict from b1 first FIFO
    - Then from t1
    - Then from b2
    - Then from t2
2. Remove from all four lists ensures complete cleanup
3. Remove from main cache

This ensures that:
- Transient items are evicted first
- Stable items are preserved longer
- No stale references remain in any list

## State Transitions

```mermaid
stateDiagram-v2
    [*] --> Transient: set
    Transient --> Stable: get
    Stable --> Transient: adjust
    Transient --> Evicted: eviction
    Stable --> Evicted: eviction
    Evicted --> Stable: adjust
```

### State Transition Table

| Current State | Action | New State |
|---------------|--------|-----------|
| Not in cache | set | b1 transient |
| b1 transient | get | b2 stable |
| b2 stable | get | b2 stable moves to end |
| t1 evicted | get | t2 evicted stable |
| t2 evicted | get | t2 evicted stable moves to end |
| Any | adjust | Balance lists based on access patterns |
| Any | eviction | Removed from all lists and cache |

## Memory Management

### Cleanup on Delete

When delete key is called:

```javascript
this.cache.delete(key);
this.b1.delete(key);
this.b2.delete(key);
this.t1.delete(key);
this.t2.delete(key);
```

All references are removed to prevent memory leaks and stale data.

### Clear Operation

When clear is called all maps are cleared simultaneously:

```javascript
this.cache.clear();
this.b1.clear();
this.b2.clear();
this.t1.clear();
this.t2.clear();
```

## Performance Characteristics

| Operation | Time Complexity | Notes |
|-----------|-----------------|-------|
| get | O1 | Map lookups are constant time |
| set | On | May evict n items before insertion |
| delete | O1 | Direct Map deletions |
| has | O1 | Map lookup |
| clear | O1 | Map.clear |
| adjust | On | May move n items between lists |

## Factory Function

The arc factory provides a convenient way to create cache instances:

```javascript
export function arc(size = 50) {
  return new ARC(size);
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| size | number | 50 | Maximum cache size |

## Design Decisions

### Why 5 Maps?

- **cache**: Single source of truth for cached values
- **b1/b2**: Distinguish between recently and frequently accessed
- **t1/t2**: Track evicted items for adaptive behavior

The b1/b2 and t1/t2 split allows ARC to adaptively determine whether to favor recency or frequency based on observed access patterns.

### Why Evict All Lists?

When evicting, all four lists are checked because:
1. The adjust method may move items between lists
2. A key might be in any list depending on access pattern
3. Complete cleanup prevents memory leaks and stale references

### Why Use Transient and Stable Lists?

This design allows the cache to:
- Quickly identify recently accessed items b1 and t1
- Identify frequently accessed items b2 and t2
- Make intelligent eviction decisions based on patterns
- Maintain a hybrid of LRU recency and LFU frequency behavior

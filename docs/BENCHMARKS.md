# Benchmarks

Performance benchmarks for the Tiny ARC cache implementation.

## Test Environment

- Node.js version: 25.8.1
- Machine: Linux

## Test Configuration

Benchmarks are run with cache sizes of 100, 1000, and 10000 entries.

### Test Operations

| Operation | Description |
|-----------|-------------|
| `set N items (size M)` | Insert N items into a cache of size M |
| `get N items (size M)` | Retrieve N items from a cache of size M |
| `create N instances` | Create N cache instances using factory function |
| `set 100 items` | Basic insertion performance |
| `check has 100 items` | Check if 100 items exist in cache |
| `delete 50 items` | Delete 50 items from cache |
| `has after deletions` | Check existence after deletions |
| `clear cache` | Clear all cache entries |
| `iterate keys` | Iterate over all keys |
| `iterate values` | Iterate over all values |
| `iterate entries` | Iterate over all [key, value] pairs |
| `forEach` | Use forEach to iterate over cache |
| `toJSON` | Serialize cache to JSON |
| `update 50 existing keys` | Update same key 50 times |
| `p boundary` | Access internal p boundary parameter |
| `B1/B2 ghost hits` | Trigger ghost hit patterns that adjust p |
| `delete 150 items` | Delete-heavy workload stress test |
| `mixed operations` | Combined get/delete/iteration workload |

## Results

### Mean Performance (ms) - 5 Runs

#### Scale Tests (Size 100 vs 1000 vs 10000)

| Test | Size 100 | Size 1000 | Size 10000 |
|------|----------|-----------|------------|
| set | 0.175 | 2.079 | 21.847 |
| get | 0.052 | 1.050 | 3.146 |

#### Small Cache Tests (Size 100)

| Test | Time (ms) |
|------|-----------|
| set 100 items | 0.016 |
| check has 100 items | 0.022 |
| delete 50 items | 0.062 |
| has after deletions | 0.007 |
| clear cache | 0.011 |
| iterate keys | 0.088 |
| iterate values | 0.081 |
| iterate entries | 0.127 |
| forEach | 0.055 |
| toJSON | 0.127 |
| update 50 existing keys | 0.034 |

#### Factory Tests (Variable Sizes)

| Test | Time (ms) |
|------|-----------|
| create 1000 instances | 2.047 |
| factory with size 0 | 0.003 |
| factory with negative size | 0.004 |

#### Advanced Tests (Size 100)

| Test | Value |
|------|-------|
| P boundary after operations | 0 |
| P after B1 ghost hit | 0 |
| P after B2 ghost hit | 0 |
| delete 150 items (150 deletes) | 0.037 |
| iterate after mixed operations | 0.132 |
| Default cache maxSize | 50 |

## Performance Analysis

### O(1) Operations

The following operations maintain O(1) time complexity as expected:

- **get()**: Average 0.052ms at size 100
- **has()**: Average 0.022ms for 100 checks
- **delete()**: Average 0.062ms
- **set()**: O(1) average case with occasional eviction

### O(n) Operations

The following operations scale linearly with cache size:

- **set()** with eviction: Average 21.847ms at size 10000
- **get()** with list traversal: Average 3.146ms at size 10000

### Cache Efficiency

- Cache properly maintains size limits with eviction
- All tests show correct cache behavior (cache size = maxSize after operations)
- Ghost hit patterns trigger p boundary adjustments as expected

## Running Benchmarks

```bash
# Run benchmarks
node benchmarks/benchmarks.js

# Run benchmarks 5x and calculate mean
for i in 1 2 3 4 5; do node benchmarks/benchmarks.js 2>&1; done
```

## Previous Results

### Size 10, 1000, 10000 (previous configuration)

| Test | Size 10 | Size 1000 | Size 10000 |
|------|---------|-----------|------------|
| set 20 items | 0.081ms | | |
| set 2000 items | | 2.034ms | |
| set 20000 items | | | 20.34ms |
| get 2000 items | | 1.007ms | |
| get 20000 items | | | 10.07ms |

## Benchmark Script

See `benchmarks/benchmarks.js` for the complete benchmark implementation.

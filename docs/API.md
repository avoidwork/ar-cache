# API Documentation

## ARC Class

The main cache class implementing the Adaptive Replacement Cache (ARC) algorithm.

### Constructor

```javascript
new ARC(size)
```

| Parameter | Type   | Default | Description              |
|-----------|--------|---------|--------------------------|
| size      | number | 100     | Maximum cache size       |

### Instance Methods

#### get(key)

Retrieve a value from the cache by key. Updates access patterns internally.

```javascript
const value = cache.get('key');
```

| Parameter | Type             | Description           |
|-----------|------------------|-----------------------|
| key       | string \| number | The key to retrieve   |

| Return Type              | Description                   |
|--------------------------|-------------------------------|
| any \| undefined         | The cached value or undefined |

#### set(key, value)

Store a value in the cache by key. Automatically evicts oldest entries if cache is at capacity.

```javascript
cache.set('key', 'value');
```

| Parameter | Type             | Description              |
|-----------|------------------|--------------------------|
| key       | string \| number | The key to set           |
| value     | any              | The value to cache       |

#### delete(key)

Remove a key and all its references from the cache.

```javascript
cache.delete('key');
```

| Parameter | Type             | Description           |
|-----------|------------------|-----------------------|
| key       | string \| number | The key to delete     |

#### has(key)

Check if a key exists in the cache.

```javascript
const exists = cache.has('key');
```

| Parameter | Type             | Description           |
|-----------|------------------|-----------------------|
| key       | string \| number | The key to check      |

| Return Type | Description         |
|-------------|---------------------|
| boolean     | True if key exists  |

#### clear()

Remove all entries from the cache.

```javascript
cache.clear();
```

#### keys()

Returns an iterator over all cache keys.

```javascript
for (const key of cache.keys()) {
  console.log(key);
}
```

| Return Type | Description      |
|-------------|------------------|
| Iterator    | Key iterator     |

#### values()

Returns an iterator over all cache values.

```javascript
for (const value of cache.values()) {
  console.log(value);
}
```

| Return Type | Description       |
|-------------|-------------------|
| Iterator    | Value iterator    |

#### entries()

Returns an iterator over all [key, value] pairs.

```javascript
for (const [key, value] of cache.entries()) {
  console.log(key, value);
}
```

| Return Type | Description         |
|-------------|---------------------|
| Iterator    | Entry iterator      |

#### forEach(callback)

Iterate over all entries with a callback function.

```javascript
cache.forEach((value, key, cacheInstance) => {
  console.log(value, key);
});
```

| Parameter | Type     | Description                      |
|-----------|----------|----------------------------------|
| callback  | Function | Function to call for each entry  |

#### toJSON()

Returns a JSON-serializable representation of the cache.

```javascript
const json = cache.toJSON();
```

| Return Type | Description                        |
|-------------|------------------------------------|
| Object      | Serializable representation        |

### Instance Properties

#### size (readOnly)

Get the current number of entries in the cache.

```javascript
console.log(cache.size);
```

| Return Type | Description              |
|-------------|--------------------------|
| number      | Number of cache entries  |

#### maxSize (readOnly)

Get the maximum cache size.

```javascript
console.log(cache.maxSize);
```

| Return Type | Description           |
|-------------|-----------------------|
| number      | Maximum cache size    |

## Factory Function

### arc()

Factory function to create a new ARC cache instance with optional configuration.

```javascript
const cache = arc({ size: 50 });
```

| Parameter | Type   | Default | Description              |
|-----------|--------|---------|--------------------------|
| options   | Object | {}      | Configuration options    |
| options.size | number | 100  | Maximum cache size       |

| Return Type | Description            |
|-------------|------------------------|
| ARC         | New ARC cache instance |

## Examples

### Basic Usage

```javascript
import { ARC, arc } from 'adaptive-replacement-cache';

// Using the class directly
const cache1 = new ARC(100);
cache1.set('key', 'value');
const value = cache1.get('key');

// Using the factory
const cache2 = arc({ size: 50 });
cache2.set('user', { id: 1, name: 'John' });
```

### Iterating Over Cache

```javascript
// Using iterator
for (const [key, value] of cache.entries()) {
  console.log(key, value);
}

// Using forEach
cache.forEach((value, key) => {
  console.log(key, value);
});
```

### JSON Serialization

```javascript
const cache = new ARC(10);
cache.set('key1', 'value1');
cache.set('key2', 'value2');

const json = cache.toJSON();
// { size: 2, entries: [['key1', 'value1'], ['key2', 'value2']] }
```

import { ARC, arc } from "../src/arc.js";

console.log("ARC Benchmarks");
console.log("==============\n");

// Test with small cache (size 100)
const smallCache = new ARC(100);
const smallKeys = Array.from({ length: 200 }, (_, i) => `key${i}`);

console.time("set 200 items to cache size 100");
for (const key of smallKeys) {
	smallCache.set(key, `value${key}`);
}
console.timeEnd("set 200 items to cache size 100");

console.time("get 200 items from cache size 100");
for (const key of smallKeys) {
	smallCache.get(key);
}
console.timeEnd("get 200 items from cache size 100");

console.log(`Cache size after operations: ${smallCache.size}`);
console.log(`Max size: ${smallCache.maxSize}\n`);

// Test with medium cache (size 1000)
const mediumCache = new ARC(1000);
const mediumKeys = Array.from({ length: 2000 }, (_, i) => `mediumkey${i}`);

console.time("set 2000 items to cache size 1000");
for (const key of mediumKeys) {
	mediumCache.set(key, { data: `value${key}`, timestamp: Date.now() });
}
console.timeEnd("set 2000 items to cache size 1000");

console.time("get 2000 items from cache size 1000");
for (const key of mediumKeys) {
	mediumCache.get(key);
}
console.timeEnd("get 2000 items from cache size 1000");

console.log(`Cache size after operations: ${mediumCache.size}`);
console.log(`Max size: ${mediumCache.maxSize}\n`);

// Test with large cache (size 10000)
const largeCache = new ARC(10000);
const largeKeys = Array.from({ length: 20000 }, (_, i) => `largekey${i}`);

console.time("set 20000 items to cache size 10000");
for (const key of largeKeys) {
	largeCache.set(key, { data: `value${key}`, timestamp: Date.now() });
}
console.timeEnd("set 20000 items to cache size 10000");

console.time("get 20000 items from cache size 10000");
for (const key of largeKeys) {
	largeCache.get(key);
}
console.timeEnd("get 20000 items from cache size 10000");

console.log(`Cache size after operations: ${largeCache.size}`);
console.log(`Max size: ${largeCache.maxSize}\n`);

// Test factory function
console.time("create 1000 cache instances with factory");
for (let i = 0; i < 1000; i++) {
	arc({ size: 50 + i });
}
console.timeEnd("create 1000 cache instances with factory");
console.log();

// Test delete and has operations
const testCache = new ARC(100);
const testKeys = Array.from({ length: 100 }, (_, i) => `testkey${i}`);

console.time("set 100 items");
for (const key of testKeys) {
	testCache.set(key, `value${key}`);
}
console.timeEnd("set 100 items");

console.time("check has for 100 items");
for (const key of testKeys) {
	testCache.has(key);
}
console.timeEnd("check has for 100 items");

console.time("delete 50 items");
for (let i = 0; i < 50; i++) {
	testCache.delete(testKeys[i]);
}
console.timeEnd("delete 50 items");

console.time("has after deletions");
for (const key of testKeys) {
	testCache.has(key);
}
console.timeEnd("has after deletions");

console.log(`Final cache size: ${testCache.size}\n`);

// Test clear
console.time("clear cache");
testCache.clear();
console.timeEnd("clear cache");
console.log(`Cache size after clear: ${testCache.size}\n`);

// Test iteration with size 1000
const iterCache = new ARC(1000);
const iterKeys = Array.from({ length: 1000 }, (_, i) => `iterkey${i}`);

for (const key of iterKeys) {
	iterCache.set(key, `value${key}`);
}

console.time("iterate keys");
for (const _key of iterCache.keys()) {
	// Access key
}
console.timeEnd("iterate keys");

console.time("iterate values");
for (const _value of iterCache.values()) {
	// Access value
}
console.timeEnd("iterate values");

console.time("iterate entries");
for (const _entry of iterCache.entries()) {
	// Access [key, value]
}
console.timeEnd("iterate entries");

console.time("forEach");
iterCache.forEach((_value, _key) => {
	// Process entry
});
console.timeEnd("forEach");
console.log();

// Test toJSON
console.time("toJSON");
const json = iterCache.toJSON();
console.timeEnd("toJSON");
console.log(`JSON size property: ${json.size}`);
console.log(`JSON entries count: ${json.entries.length}\n`);

// Test update existing key
const updateCache = new ARC(100);

console.time("update 50 existing keys");
for (let i = 0; i < 50; i++) {
	updateCache.set("updatekey", `value${i}`);
}
console.timeEnd("update 50 existing keys");
console.log(`Cache size after updates: ${updateCache.size}\n`);

// Test factory with default size
const defaultCache = arc();
console.log(`Default cache maxSize: ${defaultCache.maxSize}`);
console.log(`Default cache size: ${defaultCache.size}`);

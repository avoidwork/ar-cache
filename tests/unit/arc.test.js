import { ARC, arc } from "../../src/arc.js";
import test from "node:test";
import assert from "node:assert";

test("ARC class - constructor", () => {
	const cache = new ARC(10);
	assert.strictEqual(cache.maxSize, 10);
	assert.strictEqual(cache.size, 0);
});

test("ARC class - constructor default size", () => {
	const cache = new ARC();
	assert.strictEqual(cache.maxSize, 100);
	assert.strictEqual(cache.size, 0);
});

test("ARC class - set and get", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	assert.strictEqual(cache.get("key1"), "value1");
});

test("ARC class - get non-existent key", () => {
	const cache = new ARC(10);
	assert.strictEqual(cache.get("nonexistent"), undefined);
});

test("ARC class - delete", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	assert.strictEqual(cache.has("key1"), true);
	cache.delete("key1");
	assert.strictEqual(cache.has("key1"), false);
	assert.strictEqual(cache.get("key1"), undefined);
});

test("ARC class - has", () => {
	const cache = new ARC(10);
	assert.strictEqual(cache.has("key1"), false);
	cache.set("key1", "value1");
	assert.strictEqual(cache.has("key1"), true);
});

test("ARC class - clear", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	cache.set("key2", "value2");
	cache.clear();
	assert.strictEqual(cache.size, 0);
	assert.strictEqual(cache.has("key1"), false);
	assert.strictEqual(cache.has("key2"), false);
});

test("ARC class - size getter", () => {
	const cache = new ARC(10);
	assert.strictEqual(cache.size, 0);
	cache.set("key1", "value1");
	assert.strictEqual(cache.size, 1);
	cache.set("key2", "value2");
	assert.strictEqual(cache.size, 2);
});

test("ARC class - maxSize getter", () => {
	const cache = new ARC(50);
	assert.strictEqual(cache.maxSize, 50);
});

test("ARC class - keys iterator", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	cache.set("key2", "value2");
	const keys = [...cache.keys()];
	assert.deepStrictEqual(keys, ["key1", "key2"]);
});

test("ARC class - values iterator", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	cache.set("key2", "value2");
	const values = [...cache.values()];
	assert.deepStrictEqual(values, ["value1", "value2"]);
});

test("ARC class - entries iterator", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	cache.set("key2", "value2");
	const entries = [...cache.entries()];
	assert.deepStrictEqual(entries, [
		["key1", "value1"],
		["key2", "value2"],
	]);
});

test("ARC class - forEach", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	cache.set("key2", "value2");
	const results = [];
	cache.forEach((value, key) => results.push({ key, value }));
	assert.strictEqual(results.length, 2);
});

test("ARC class - toJSON", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	cache.set("key2", "value2");
	const json = cache.toJSON();
	assert.strictEqual(json.size, 2);
	assert.deepStrictEqual(json.entries, [
		["key1", "value1"],
		["key2", "value2"],
	]);
});

test("ARC class - update existing key", () => {
	const cache = new ARC(10);
	cache.set("key1", "value1");
	cache.set("key1", "value2");
	assert.strictEqual(cache.get("key1"), "value2");
	assert.strictEqual(cache.size, 1);
});

test("ARC class - arc factory", () => {
	const cache = arc({ size: 20 });
	assert.ok(cache instanceof ARC);
	assert.strictEqual(cache.maxSize, 20);
});

test("ARC class - arc factory default", () => {
	const cache = arc();
	assert.ok(cache instanceof ARC);
	assert.strictEqual(cache.maxSize, 100);
});

test("ARC class - eviction when over capacity", () => {
	const cache = new ARC(3);
	cache.set("key1", "value1");
	cache.set("key2", "value2");
	cache.set("key3", "value3");
	cache.set("key4", "value4");
	assert.strictEqual(cache.size, 3);
	assert.strictEqual(cache.has("key4"), true);
});

test("ARC class - ghost hit b1 increases t1", () => {
	const cache = new ARC(4);
	cache.set("a", 1);
	cache.set("b", 2);
	cache.set("c", 3);
	cache.set("d", 4);
	cache.delete("a");
	cache.set("a", 10);
	assert.strictEqual(cache.t1.has("a"), true);
});

test("ARC class - t2 promotion on multiple hits", () => {
	const cache = new ARC(4);
	cache.set("a", 1);
	cache.set("b", 2);
	cache.get("a");
	cache.get("b");
	cache.get("a");
	cache.get("b");
	cache.set("c", 3);
	cache.set("d", 4);
	assert.strictEqual(cache.size, 4);
});

test("ARC class - multiple evictions", () => {
	const cache = new ARC(2);
	cache.set("a", 1);
	cache.set("b", 2);
	cache.set("a", 10);
	cache.set("c", 3);
	assert.strictEqual(cache.size, 2);
	assert.strictEqual(cache.has("a"), false);
	assert.strictEqual(cache.has("b"), true);
	assert.strictEqual(cache.has("c"), true);
});

test("ARC class - adjust boundary", () => {
	const cache = new ARC(6);
	cache.set("a", 1);
	cache.set("b", 2);
	cache.set("c", 3);
	cache.set("d", 4);
	cache.set("e", 5);
	cache.set("f", 6);
	assert.strictEqual(cache.size, 6);
});

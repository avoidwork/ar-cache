import { ARC, arc } from "../../src/arc.js";
import test from "node:test";
import assert from "node:assert";
import records from "../fixtures/records.json" with { type: "json" };

test("ARC class - constructor", () => {
	const cache = new ARC(50);
	assert.strictEqual(cache.maxSize, 50);
	assert.strictEqual(cache.size, 0);
});

test("ARC class - constructor default size", () => {
	const cache = new ARC();
	assert.strictEqual(cache.maxSize, 50);
	assert.strictEqual(cache.size, 0);
});

test("ARC class - set and get", () => {
	const cache = new ARC(50);
	const record = records[0];
	cache.set(record.id, record);
	assert.strictEqual(cache.get(record.id), record);
});

test("ARC class - get non-existent key", () => {
	const cache = new ARC(50);
	assert.strictEqual(cache.get("nonexistent"), undefined);
});

test("ARC class - delete", () => {
	const cache = new ARC(50);
	const record = records[0];
	cache.set(record.id, record);
	assert.strictEqual(cache.has(record.id), true);
	cache.delete(record.id);
	assert.strictEqual(cache.has(record.id), false);
	assert.strictEqual(cache.get(record.id), undefined);
});

test("ARC class - has", () => {
	const cache = new ARC(50);
	assert.strictEqual(cache.has("key1"), false);
	const record = records[0];
	cache.set(record.id, record);
	assert.strictEqual(cache.has(record.id), true);
});

test("ARC class - clear", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.clear();
	assert.strictEqual(cache.size, 0);
	assert.strictEqual(cache.has(records[0].id), false);
	assert.strictEqual(cache.has(records[1].id), false);
});

test("ARC class - size getter", () => {
	const cache = new ARC(50);
	assert.strictEqual(cache.size, 0);
	cache.set(records[0].id, records[0]);
	assert.strictEqual(cache.size, 1);
	cache.set(records[1].id, records[1]);
	assert.strictEqual(cache.size, 2);
});

test("ARC class - maxSize getter", () => {
	const cache = new ARC(50);
	assert.strictEqual(cache.maxSize, 50);
});

test("ARC class - keys iterator", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	const keys = [...cache.keys()];
	assert.deepStrictEqual(keys, [records[0].id, records[1].id]);
});

test("ARC class - values iterator", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	const values = [...cache.values()];
	assert.deepStrictEqual(values, [records[0], records[1]]);
});

test("ARC class - entries iterator", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	const entries = [...cache.entries()];
	assert.deepStrictEqual(entries, [
		[records[0].id, records[0]],
		[records[1].id, records[1]],
	]);
});

test("ARC class - forEach", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	const results = [];
	cache.forEach((value, key) => results.push({ key, value }));
	assert.strictEqual(results.length, 2);
});

test("ARC class - toJSON", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	const json = cache.toJSON();
	assert.strictEqual(json.size, 2);
	assert.deepStrictEqual(json.entries, [
		[records[0].id, records[0]],
		[records[1].id, records[1]],
	]);
});

test("ARC class - update existing key", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	const updatedRecord = { ...records[0], value: 999 };
	cache.set(records[0].id, updatedRecord);
	assert.strictEqual(cache.get(records[0].id), updatedRecord);
	assert.strictEqual(cache.size, 1);
});

test("ARC class - arc factory", () => {
	const cache = arc(50);
	assert.ok(cache instanceof ARC);
	assert.strictEqual(cache.maxSize, 50);
});

test("ARC class - arc factory default", () => {
	const cache = arc();
	assert.ok(cache instanceof ARC);
	assert.strictEqual(cache.maxSize, 50);
});

test("ARC class - eviction when over capacity", () => {
	const cache = new ARC(3);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	assert.strictEqual(cache.size, 3);
	assert.strictEqual(cache.has(records[3].id), true);
});

test("ARC class - ghost hit b1 increases t1", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.delete(records[0].id);
	cache.set(records[0].id, { ...records[0], value: 10 });
	assert.strictEqual(cache.t1.has(records[0].id), true);
});

test("ARC class - t2 promotion on multiple hits", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	assert.strictEqual(cache.size, 4);
});

test("ARC class - multiple evictions", () => {
	const cache = new ARC(2);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[0].id, { ...records[0], value: 10 });
	cache.set(records[2].id, records[2]);
	assert.strictEqual(cache.size, 2);
	assert.strictEqual(cache.has(records[0].id), true);
	assert.strictEqual(cache.has(records[1].id), false);
	assert.strictEqual(cache.has(records[2].id), true);
});

test(" ARC class - adjust boundary", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	cache.set(records[5].id, records[5]);
	assert.strictEqual(cache.size, 6);
});

test("ARC class - T1 to T2 promotion", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	assert.strictEqual(cache.t2.has(records[0].id), true);
	assert.strictEqual(cache.t2.has(records[1].id), true);
});

test("ARC class - T2 promotion on multiple hits", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	assert.strictEqual(cache.t2.has(records[0].id), true);
	assert.strictEqual(cache.t2.has(records[1].id), true);
});

test("ARC class - cache at capacity eviction", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	assert.strictEqual(cache.size, 5);
	assert.strictEqual(cache.has(records[4].id), true);
});

test("ARC class - B1 ghost hit in set", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	assert.ok(cache.b1.has(records[0].id));
	const updatedRecord = { ...records[0], value: 100 };
	cache.set(records[0].id, updatedRecord);
	assert.strictEqual(cache.get(records[0].id), updatedRecord);
});

test("ARC class - B1 ghost hit after multiple evictions", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	cache.set(records[5].id, records[5]);
	assert.ok(cache.b1.has(records[0].id));
	const updatedRecord = { ...records[0], value: 100 };
	cache.set(records[0].id, updatedRecord);
	assert.strictEqual(cache.get(records[0].id), updatedRecord);
});

test("ARC class - get t1 to t2 promotion path", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	assert.strictEqual(cache.t1.has(records[0].id), false);
	assert.strictEqual(cache.t2.has(records[0].id), true);
});

test("ARC class - adjust t1 boundary", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.get(records[0].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[1].id);
	cache.set(records[4].id, records[4]);
	assert.strictEqual(cache.size, 5);
});

test("ARC class - T2 promotion on multiple hits", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	assert.strictEqual(cache.t2.has(records[0].id), true);
	assert.strictEqual(cache.t2.has(records[1].id), true);
});

test("ARC class - cache at capacity eviction", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	assert.strictEqual(cache.size, 5);
	assert.strictEqual(cache.has(records[4].id), true);
});

test("ARC class - adjust t1 boundary", () => {
	const cache = new ARC(50);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.get(records[0].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[1].id);
	cache.set(records[4].id, records[4]);
	assert.strictEqual(cache.size, 5);
});

test("ARC class - B1 ghost hit with B2 populated", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	assert.strictEqual(cache.size, 4);
	assert.strictEqual(cache.b1.size, 1);
	assert.strictEqual(cache.b2.size, 0);
	assert.ok(cache.b1.has(records[2].id));
	cache.delete(records[2].id);
	assert.strictEqual(cache.b1.size, 0);
	assert.ok(cache.b2.has(records[0].id));
	cache.set(records[5].id, records[5]);
	assert.strictEqual(cache.size, 4);
});

test("ARC class - p getter", () => {
	const cache = new ARC(50);
	assert.strictEqual(cache.p, 0);
	cache.set(records[0].id, records[0]);
	assert.strictEqual(cache.p, 0);
});

test("ARC class - bulk insert with synthesized records", () => {
	const cache = new ARC(50);
	const testRecords = records.slice(0, 25);
	testRecords.forEach((record) => {
		cache.set(record.id, record);
	});
	assert.strictEqual(cache.size, 25);
	testRecords.forEach((record) => {
		assert.strictEqual(cache.has(record.id), true);
	});
});

test("ARC class - B2 ghost hit", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.delete(records[0].id);
	cache.set(records[0].id, records[0]);
	const updatedRecord = { ...records[0], value: 200 };
	cache.set(records[0].id, updatedRecord);
	assert.strictEqual(cache.get(records[0].id), updatedRecord);
});

test("ARC class - T2 promotion and eviction", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	assert.strictEqual(cache.t2.has(records[0].id), true);
	assert.strictEqual(cache.t2.has(records[1].id), true);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	assert.strictEqual(cache.size, 4);
});

test("ARC class - B1 ghost hit with t2 entries", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.delete(records[0].id);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	cache.set(records[0].id, records[0]);
	assert.strictEqual(cache.get(records[0].id), records[0]);
});

test("ARC class - B2 ghost hit with t1 entries", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.delete(records[1].id);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);
	cache.set(records[1].id, records[1]);
	assert.strictEqual(cache.get(records[1].id), records[1]);
});

test("ARC class - B1 ghost hit with T2 entries covering t2.delete", () => {
	const cache = new ARC(5);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);

	// Promote records[0] and records[1] to T2
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);

	// Evict 2 entries, records[2] and records[3] go to B1
	cache.set(records[5].id, records[5]);
	cache.set(records[6].id, records[6]);

	// T2 should have 2 entries (records[0], records[1])
	assert.strictEqual(cache.t2.size, 2);

	// B1 ghost hit on records[2] - this should delete from T2 (lines 62-63)
	cache.delete(records[2].id);
	cache.set(records[2].id, records[2]);

	// T2 should have 1 entry (one was deleted during B1 ghost hit)
	assert.strictEqual(cache.t2.size, 1);
});

test("ARC class - B2 ghost hit with T1 entries covering t1.delete and b1.set", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.set(records[4].id, records[4]);
	cache.set(records[5].id, records[5]);

	// Manually add to b2 to enable B2 ghost hit
	cache.b2.set(records[6].id, true);

	// Get t1 key before B2 ghost hit
	const t1KeysBefore = [...cache.t1.keys()];

	cache.delete(records[6].id);
	cache.set(records[6].id, records[6]);

	// T1 should have lost an entry (deleted by B2 ghost hit handler)
	assert.strictEqual(cache.t1.size, t1KeysBefore.length - 1);

	// The deleted key should now be in b1
	const deletedKey = t1KeysBefore.find((k) => !cache.t1.has(k));
	assert.ok(deletedKey !== undefined);
	assert.ok(cache.b1.has(deletedKey));
});

test("ARC class - B1 ghost hit via set with T2 eviction", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.set(records[4].id, records[4]);

	// T2 should have 2 entries, B1 should have 1 entry (records[2])
	assert.strictEqual(cache.t2.size, 2);
	assert.ok(cache.b1.has(records[2].id));

	// B1 ghost hit on records[2] via set should evict from T2 (lines 62-63)
	cache.set(records[2].id, { ...records[2], value: 999 });

	// T2 should have 1 entry (one was evicted during B1 ghost hit)
	assert.strictEqual(cache.t2.size, 1);
	assert.strictEqual(cache.get(records[2].id).value, 999);
});

test("ARC class - B2 ghost hit via set with T1 eviction", () => {
	const cache = new ARC(4);
	cache.set(records[0].id, records[0]);
	cache.set(records[1].id, records[1]);
	cache.set(records[2].id, records[2]);
	cache.set(records[3].id, records[3]);
	cache.get(records[0].id);
	cache.get(records[1].id);
	cache.get(records[0].id);
	cache.get(records[1].id);

	// Manually add to b2 to simulate B2 ghost
	cache.b2.set(records[4].id, true);

	// T1 should have entries, B2 has ghost
	assert.strictEqual(cache.t1.size, 2);

	// B2 ghost hit on records[4] via set should evict from T1 (lines 74-75)
	cache.set(records[4].id, records[4]);

	// T1 should have 1 entry (one was evicted during B2 ghost hit)
	assert.strictEqual(cache.t1.size, 1);
	assert.strictEqual(cache.get(records[4].id), records[4]);
});

import { ARC } from "./src/arc.js";
import records from "./tests/fixtures/records.json" with { type: "json" };

const cache = new ARC(4);

cache.set(records[0].id, records[0]); // 1
cache.set(records[1].id, records[1]); // 2
cache.set(records[2].id, records[2]); // 3
cache.set(records[3].id, records[3]); // 4

cache.get(records[0].id);
cache.get(records[1].id);
cache.set(records[4].id, records[4]); // 5 - evict 3 to b1
cache.set(records[5].id, records[5]); // 6 - evict 4 to b1

console.log(`b1=[3, 4], b2=[]`);

// B1 ghost on 3
cache.delete(3);
cache.set(3, records[2]);
console.log(`After B1 ghost on 3: b1=[3, 4], b2=[1]`);

// B1 ghost on 4
cache.delete(4);
cache.set(4, records[3]);
console.log(`After B1 ghost on 4: b1=[3, 4], b2=[1, 2]`);

// Now b2 has 2 entries, b1 has 2 entries
// b1 === b2, not b1 < b2

// Need b1 < b2. So delete from b1.
cache.delete(5);
console.log(`After delete 5: b1=[3, 4, 6], b2=[1, 2]`);

// No wait, delete removes from ALL lists
// Let me try something else

// The issue is that delete() removes from b1 too
// We need a way to remove from b1 without removing from cache

// Actually, what if we just keep adding to b2 via B1 ghost hits
// while b1 stays the same?

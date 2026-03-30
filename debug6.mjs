import { ARC } from "./src/arc.js";
import records from "./tests/fixtures/records.json" with { type: "json" };

const cache = new ARC(4);

cache.set(records[0].id, records[0]); // id=1
cache.set(records[1].id, records[1]); // id=2
cache.set(records[2].id, records[2]); // id=3
cache.set(records[3].id, records[3]); // id=4

cache.get(records[0].id);
cache.get(records[1].id);
cache.set(records[4].id, records[4]); // id=5 - evicts 3 to b1
cache.set(records[5].id, records[5]); // id=6 - evicts 4 to b1

console.log(`b1=[${[...cache.b1.keys()].join(', ')}]`); // Should be [3, 4]

// Now do B1 ghost on record with id=3
console.log(`\nB1 ghost on id=3: b1.has(3)=${cache.b1.has(3)}`);
cache.delete(3);
console.log(`After delete: b1=[${[...cache.b1.keys()].join(', ')}]`);
cache.set(3, records[2]); // id=3 is back
console.log(`After B1 ghost: b1=[${[...cache.b1.keys()].join(', ')}], b2=[${[...cache.b2.keys()].join(', ')}]`);

// b1 should still have [3, 4] after B1 ghost (b1 ghost doesn't add to b1)
// But T2 was deleted (T2 has id=1,2)

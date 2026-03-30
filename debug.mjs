import { ARC } from "./src/arc.js";
import records from "./tests/fixtures/records.json" with { type: "json" };

const cache = new ARC(4);

cache.set(records[0].id, records[0]);
cache.set(records[1].id, records[1]);
cache.set(records[2].id, records[2]);
cache.set(records[3].id, records[3]);

cache.get(records[0].id);
cache.get(records[1].id);

console.log(`1. t1=[${[...cache.t1.keys()].join(', ')}], t2=[${[...cache.t2.keys()].join(', ')}]`);

cache.set(records[4].id, records[4]);
cache.set(records[5].id, records[5]);
console.log(`2. After evictions: b1=[${[...cache.b1.keys()].join(', ')}], b2=[${[...cache.b2.keys()].join(', ')}]`);

// Do B1 ghost hits to populate b2
cache.delete(records[2].id);
cache.set(records[2].id, records[2]);
console.log(`3. After B1 ghost on 2: b2=[${[...cache.b2.keys()].join(', ')}]`);

cache.delete(records[3].id);
cache.set(records[3].id, records[3]);
console.log(`4. After B1 ghost on 3: b2=[${[...cache.b2.keys()].join(', ')}]`);

cache.delete(records[4].id);
cache.set(records[4].id, records[4]);
console.log(`5. After B1 ghost on 4: b2=[${[...cache.b2.keys()].join(', ')}]`);

// Now b2 has entries. But b1 also has entries from evictions.
// We need b1 < b2 for T2 eviction to trigger.
// Let's check sizes
console.log(`b1.size=${cache.b1.size}, b2.size=${cache.b2.size}`);

// Actually, after B1 ghost hit, 2 should be back in t1
console.log(`t1=[${[...cache.t1.keys()].join(', ')}]`);

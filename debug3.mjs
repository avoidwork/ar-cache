import { ARC } from "./src/arc.js";
import records from "./tests/fixtures/records.json" with { type: "json" };

const cache = new ARC(4);

cache.set(records[0].id, records[0]);
cache.set(records[1].id, records[1]);
cache.set(records[2].id, records[2]);
cache.set(records[3].id, records[3]);

cache.get(records[0].id);
cache.get(records[1].id);
cache.set(records[4].id, records[4]);
cache.set(records[5].id, records[5]);

console.log(`b1=[${[...cache.b1.keys()].join(', ')}]`);

// Check if 2 is in b1
console.log(`b1.has(2): ${cache.b1.has(2)}`);
console.log(`t1.has(2): ${cache.t1.has(2)}`);
console.log(`t2.has(2): ${cache.t2.has(2)}`);

// Now do B1 ghost on 2
console.log(`\nB1 ghost on 2: b1.has(2)=${cache.b1.has(2)}`);
cache.delete(records[2].id);
console.log(`After delete: b1=[${[...cache.b1.keys()].join(', ')}]`);
cache.set(records[2].id, records[2]);
console.log(`After set: b1=[${[...cache.b1.keys()].join(', ')}], b2=[${[...cache.b2.keys()].join(', ')}]`);

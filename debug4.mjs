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

// Only 3 and 4 are in b1
// Let's do B1 ghost on 3
console.log(`\nB1 ghost on 3: b1.has(3)=${cache.b1.has(3)}`);
cache.delete(records[3].id);
console.log(`After delete: b1=[${[...cache.b1.keys()].join(', ')}]`);
cache.set(records[3].id, records[3]);
console.log(`After B1 ghost: b1=[${[...cache.b1.keys()].join(', ')}], b2=[${[...cache.b2.keys()].join(', ')}]`);

// Also do on 4
console.log(`\nB1 ghost on 4: b1.has(4)=${cache.b1.has(4)}`);
cache.delete(records[4].id);
cache.set(records[4].id, records[4]);
console.log(`After B1 ghost: b1=[${[...cache.b1.keys()].join(', ')}], b2=[${[...cache.b2.keys()].join(', ')}]`);

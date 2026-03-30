import { ARC } from "./src/arc.js";
import records from "./tests/fixtures/records.json" with { type: "json" };

const cache = new ARC(4);

cache.set(1, records[0]);
cache.set(2, records[1]);
cache.set(3, records[2]);
cache.set(4, records[3]);
cache.get(1);
cache.get(2);
cache.set(5, records[4]);
cache.set(6, records[5]);

console.log(`Step 3: cache.size=${cache.size}, t1=[${[...cache.t1.keys()].join(', ')}]`);

cache.delete(3);
cache.set(3, records[2]);
console.log(`After ghost 3: cache.size=${cache.size}, t1=[${[...cache.t1.keys()].join(', ')}]`);

cache.delete(4);
cache.set(4, records[3]);
console.log(`After ghost 4: cache.size=${cache.size}, t1=[${[...cache.t1.keys()].join(', ')}]`);

// Cache size is 6 (exceeds limit of 4)
// But B1 ghost handler didn't evict!

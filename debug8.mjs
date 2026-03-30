import { ARC } from "./src/arc.js";
import records from "./tests/fixtures/records.json" with { type: "json" };

const cache = new ARC(4);

console.log("Step 1: Fill cache");
cache.set(1, records[0]);
cache.set(2, records[1]);
cache.set(3, records[2]);
cache.set(4, records[3]);
console.log(`b1=[${[...cache.b1.keys()].join(', ')}]`);

console.log("\nStep 2: Promote to T2");
cache.get(1);
cache.get(2);
console.log(`t2=[1, 2]`);

console.log("\nStep 3: Evict 5,6");
cache.set(5, records[4]);
console.log(`b1=[${[...cache.b1.keys()].join(', ')}]`);
cache.set(6, records[5]);
console.log(`b1=[${[...cache.b1.keys()].join(', ')}]`);

console.log("\nStep 4: B1 ghost on 3");
cache.delete(3);
cache.set(3, records[2]);
console.log(`b1=[${[...cache.b1.keys()].join(', ')}], b2=[${[...cache.b2.keys()].join(', ')}]`);

console.log("\nStep 5: B1 ghost on 4");
cache.delete(4);
cache.set(4, records[3]);
console.log(`b1=[${[...cache.b1.keys()].join(', ')}], b2=[${[...cache.b2.keys()].join(', ')}]`);

console.log(`p=${cache.p}`);

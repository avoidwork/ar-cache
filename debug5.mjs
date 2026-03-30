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
cache.set(records[6].id, records[6]);

console.log(`records[6].id: ${records[6].id}`);
console.log(`b1=[${[...cache.b1.keys()].join(', ')}]`);

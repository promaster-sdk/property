import * as Benchmark from "benchmark";
import { BaseUnits, UnitMap } from "uom";
import { PropertyFilter } from "../index";

const suite = new Benchmark.Suite();

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

const pf = PropertyFilter.fromString(
  "ccc=20&a=1,2,3~10&d=-50&(ccc=20|a=1,2)&d=5|z=50",
  unitLookup
  // "a=1"
);
if (!pf) {
  throw new Error("Could not create property filter.");
}

suite
  // add tests
  .add("PropertyFilter#fromString empty", () => {
    PropertyFilter.fromString("", unitLookup);
  })
  .add("PropertyFilter#fromString whitespace", () => {
    PropertyFilter.fromString("  ", unitLookup);
  })
  .add("PropertyFilter#fromString cache hit", () => {
    PropertyFilter.fromString("ccc=20&a=1,2,3~10&d=-50&(ccc=20|a=1,2)&d=5|z=50", unitLookup);
  })
  .add("PropertyFilter#fromString cache miss", () => {
    const randomValue = Math.floor(Math.random() * 100000);
    PropertyFilter.fromString(`ccc=20&a=1,2,3~10&d=-50&(randomvalue=${randomValue}|a=1,2)&d=5|z=50`, unitLookup);
  })
  .on("start", () => {
    console.log("Started benchmark");
  })
  // add listeners
  .on("cycle", (event: Event) => {
    console.log(String(event.target));
  })
  // run async
  .run({ async: true });

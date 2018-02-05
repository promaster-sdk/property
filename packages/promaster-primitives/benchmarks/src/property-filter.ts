// tslint:disable:no-unused-expression no-this no-invalid-this no-any no-console
import * as Benchmark from "benchmark";

import { PropertyFilter, PropertyValueSet } from "../../lib-cjs";

const suite = new Benchmark.Suite();

const pf = PropertyFilter.fromString("a=1&b=2");
if (!pf) {
  throw new Error("Could not create property filter.");
}
const pvs = PropertyValueSet.fromString("a=1;b=2");

suite
  // add tests
  .add("PropertyFilter#isValid", () => {
    PropertyFilter.isValid(pvs, pf);
  })
  .add("PropertyFilter#isValid2", () => {
    PropertyFilter.isValid(pvs, pf);
  })
  .on("start", () => {
    console.log("Started benchmark");
  })
  // add listeners
  .on("cycle", (event: Event) => {
    console.log(String(event.target));
  })
  .on("complete", function(this: Benchmark.Suite): void {
    console.log(
      "Fastest is " + this.filter("fastest").map((item: any) => item)
    );
  })
  // run async
  .run({ async: true });

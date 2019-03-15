// tslint:disable:no-unused-expression no-this no-invalid-this no-any no-console
import * as Benchmark from "benchmark";

import {
  PropertyFilter,
  PropertyFilterAst,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";

const suite = new Benchmark.Suite();

const pf = PropertyFilter.fromString(
  "ccc=20&a=1,2,3~10&d=-50&(ccc=20|a=1,2)&d=5|z=50"
  // "a=1"
);
if (!pf) {
  throw new Error("Could not create property filter.");
}
const pvs = PropertyValueSet.fromString("a=1;b=2;ccc=3;d=4;z=50");

// const fake1 = (
//   _pvs: PropertyValueSet.PropertyValueSet,
//   _matchMissing: boolean
// ) => true;

// const fake2 = new Function("a", "b", "return a===b && b>a || b<a");

// const fake3 = new Function("a", "b", "return a()===b() && b()>a() || b()<a()");

// const fake2 = new Function("a", "b", "return olle");

// const fake4 = (a: () => number, b: () => number) =>
//   (a() === b() && b() > a()) || b() < a();

const fake5 = new Function(
  "obj",
  "return obj.a===obj.b && obj.b>obj.a || obj.b<obj.a"
);

suite
  // add tests
  .add("PropertyFilter#isValid", () => {
    PropertyFilter.isValid(pvs, pf);
  })
  .add("PropertyFilterAst#evaluate", () => {
    PropertyFilterAst.evaluateAst(
      pf.ast,
      pvs,
      false,
      PropertyValue.defaultComparer
    );
  })
  .add("PropertyFilter#_evaluate", () => {
    pf._evaluate(pvs, PropertyValue.defaultComparer);
  })
  // .add("PropertyFilter#lambda", () => {
  //   pf.lambda(pvs, false);
  // })
  // .add("PropertyFilter#fake1", () => {
  //   fake1(pvs, false);
  // })
  // .add("PropertyFilter#fake2", () => {
  //   fake2(1, 2);
  // })
  // .add("PropertyFilter#fake3", () => {
  //   fake3(() => 1, () => 2);
  // })
  // .add("PropertyFilter#fake4", () => {
  //   fake4(() => 1, () => 2);
  // })
  .add("PropertyFilter#fake5", () => {
    fake5({ a: 1, b: 2 });
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

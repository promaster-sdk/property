"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-unused-expression no-this no-invalid-this no-any no-console
const Benchmark = require("benchmark");
const lib_cjs_1 = require("../../lib-cjs");
const suite = new Benchmark.Suite();
const pf = lib_cjs_1.PropertyFilter.fromString("a=1&b=2");
if (!pf) {
    throw new Error("Could not create property filter.");
}
const pvs = lib_cjs_1.PropertyValueSet.fromString("a=1;b=2");
// add tests
suite
    .add("PropertyFilter#isValid", () => {
    lib_cjs_1.PropertyFilter.isValid(pvs, pf);
})
    .add("PropertyFilter#isValid2", () => {
    lib_cjs_1.PropertyFilter.isValid(pvs, pf);
})
    .on("start", () => {
    console.log("Started benchmark");
})
    .on("cycle", (event) => {
    console.log(String(event.target));
})
    .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map((item) => item));
})
    .run({ async: true });
// const bench = new Benchmark(fn);
// const x = bench.run();
// console.log("x", x);
// function fn(a: number, b: number): number {
//   return a + b;
// }
//# sourceMappingURL=property-filter.js.map
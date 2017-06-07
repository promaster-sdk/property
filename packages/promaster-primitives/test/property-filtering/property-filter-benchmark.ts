import * as PropertyFilter from "../../src/property-filtering/property-filter";

//tslint:disable

console.time("PropertyFilter.fromString");
for (let i = 0; i < 10000; i++)
  PropertyFilter.fromString("ccc=20&a=1,2,3~10&d=-50&(ccc=20|a=1,2)&d=5|z=50");
console.timeEnd("PropertyFilter.fromString");

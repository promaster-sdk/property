import {assert} from "chai";
import {buildAllPropertyValueSets, buildAllPropertyValueSetsExtended, ProductProperty, ProductPropertyValue, PropertyDefaultValue} from "../../src/variant-listing";
import * as PromasterPrimitives from "@promaster/promaster-primitives";
import {readFileSync} from "fs";
import * as Path from "path";

describe.only("buildAllPropertyValueSets", () => {
  it(`should work with CFC`, () => {
    const cfcData = JSON.parse(readFileSync(Path.join(__dirname, "./cfc.json")).toString());
    const sets = buildAllPropertyValueSetsExtended(cfcData.explicitPropertyValueSet, cfcData.variableProperties, cfcData.variableProperties, -1);
    assert.equal(sets.variants.length, cfcData.resultCount);
    assert.equal(sets.pruned, false);
  });
});

// // Values
// function valueGenerator(iter: number): ProductPropertyValue {
//   return {
//     value: { type: "integer", value: iter },
//     property_filter: PromasterPrimitives.PropertyFilter.Empty,
//     description: `integer no ${iter}`,
//   };
// }

// // ProductProperty
// function propertyGenerator(name: string, count: number): ProductProperty {
//   return {
//     sort_no: 0,
//     name: name,
//     quantity: "Discrete",
//     validation_filter: PromasterPrimitives.PropertyFilter.Empty,
//     value: (Array.apply(null, {length: count}).map(Number.call, Number)).map((i) => valueGenerator(i)),
//     def_value: [],
//   };
// }

// // Generate a list of properties
// const propertiesGenerator = (name: string, pcount: number, vcount: number): ProductProperty[] => (Array.apply(null, {length: pcount}).map(Number.call, Number)).map((i) => propertyGenerator(name + String(i), vcount));

// // PropertyValueSet
// const propertyValueSetGenerator = (properties: ProductProperty[]): PromasterPrimitives.PropertyValueSet.PropertyValueSet => properties.reduce((acc, curr) => acc[curr.name] = curr.value[0].value, {});

// const seq = (count) => Array.apply(null, {length: count}).map(Number.call, Number);


// describe("buildAllPropertyValueSets", () => {
//   seq(6).map((q) => {
//     const k = (q + 1);
//       it(`should generate ${Math.pow(6, k)} values`, () => {
//         const properties = propertiesGenerator("test", k, 6);
//         const propertyValueSet = propertyValueSetGenerator(properties);
//         const sets = buildAllPropertyValueSets(propertyValueSet, properties, properties);
//         assert.equal(sets.variants.length, Math.pow(6, k));
//       });
//   });

// });

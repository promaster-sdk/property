import { assert } from "chai";
import { buildAllPropertyValueSetsExtended } from "../../../src/variant-listing";
import * as fs from "fs";
import * as Path from "path";
import { PropertyFilter } from "../../../../promaster-primitives";
import * as R from "ramda";

// tslint:disable:max-line-length

describe("buildAllPropertyValueSets", () => {
  it(`should work with CFC`, () => {
    const cfcDataRaw = JSON.parse(
      fs.readFileSync(Path.join(__dirname, "./cfc.json")).toString()
    );
    const explicitPropertyValueSet = R.map(item => {
      return {
        ...item,
        property_filter:
          item.property_filter &&
          PropertyFilter.fromString(item.property_filter)
      };
    }, cfcDataRaw.explicitPropertyValueSet);
    // Need to go though and create PropertyFilter for all strings in the data
    const cfcData = {
      ...cfcDataRaw,
      explicitPropertyValueSet: explicitPropertyValueSet,
      // tslint:disable-next-line:no-any
      variableProperties: cfcDataRaw.variableProperties.map((a: any) => ({
        ...a,
        validation_filter: PropertyFilter.fromString(a.validation_filter),
        visibility_filter: PropertyFilter.fromString(a.visibility_filter),
        // tslint:disable-next-line:no-any
        value: a.value.map((a: any) => ({
          ...a,
          property_filter: PropertyFilter.fromString(a.property_filter)
        }))
      }))
    };
    // fs.writeFileSync(
    //   Path.join(__dirname, "./cfc_out.json"),
    //   JSON.stringify(cfcData)
    // );
    // console.log(JSON.stringify(cfcData));
    const sets = buildAllPropertyValueSetsExtended(
      cfcData.explicitPropertyValueSet,
      cfcData.variableProperties,
      cfcData.variableProperties,
      -1
    );
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

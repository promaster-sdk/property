import {assert} from "chai";
import {buildAllPropertyValueSets, Property, PropertyValueItem, PropertyDefaultValue} from "../../src/variant-listing";
import * as PromasterPrimitives from "@promaster/promaster-primitives";

// Values
function valueGenerator(iter: number): PropertyValueItem {
  return {
    value: { type: "integer", value: iter },
    sortNo: iter * 10,
    validationFilter: PromasterPrimitives.PropertyFilter.Empty,
  };
}

// Property
function propertyGenerator(name: string, count: number): Property {
  return {
    sortNo: 0,
    name: name,
    quantity: "Discrete",
    validationFilter: PromasterPrimitives.PropertyFilter.Empty,
    valueItems: (Array.apply(null, {length: count}).map(Number.call, Number)).map((i) => valueGenerator(i)),
    defaultValues: [],
  };
}

// Generate a list of properties
const propertiesGenerator = (name: string, pcount: number, vcount: number): Property[] => (Array.apply(null, {length: pcount}).map(Number.call, Number)).map((i) => propertyGenerator(name + String(i), vcount));

// PropertyValueSet
const propertyValueSetGenerator = (properties: Property[]): PromasterPrimitives.PropertyValueSet.PropertyValueSet => properties.reduce((acc, curr) => acc[curr.name] = curr.valueItems[0].value, {});

describe("buildAllPropertyValueSets", () => {
  it("should generate all values", () => {
    const properties = propertiesGenerator("test", 4, 2);
    const propertyValueSet = propertyValueSetGenerator(properties);
    const sets = buildAllPropertyValueSets(propertyValueSet, properties, properties);
    assert.equal(sets.length, 16);
  });

});

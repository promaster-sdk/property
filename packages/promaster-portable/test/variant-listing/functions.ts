import {assert} from "chai";
import {buildAllPropertyValueSets, ProductProperty, ProductPropertyValue, PropertyDefaultValue} from "../../src/variant-listing";
import * as PromasterPrimitives from "@promaster/promaster-primitives";

// Values
function valueGenerator(iter: number): ProductPropertyValue {
  return {
    value: { type: "integer", value: iter },
    property_filter: PromasterPrimitives.PropertyFilter.Empty,
    description: `integer no ${iter}`,
  };
}

// ProductProperty
function propertyGenerator(name: string, count: number): ProductProperty {
  return {
    sort_no: 0,
    name: name,
    quantity: "Discrete",
    validation_filter: PromasterPrimitives.PropertyFilter.Empty,
    value: (Array.apply(null, {length: count}).map(Number.call, Number)).map((i) => valueGenerator(i)),
    def_value: [],
  };
}

// Generate a list of properties
const propertiesGenerator = (name: string, pcount: number, vcount: number): ProductProperty[] => (Array.apply(null, {length: pcount}).map(Number.call, Number)).map((i) => propertyGenerator(name + String(i), vcount));

// PropertyValueSet
const propertyValueSetGenerator = (properties: ProductProperty[]): PromasterPrimitives.PropertyValueSet.PropertyValueSet => properties.reduce((acc, curr) => acc[curr.name] = curr.value[0].value, {});

describe("buildAllPropertyValueSets", () => {
  it("should generate all values", () => {
    const properties = propertiesGenerator("test", 4, 2);
    const propertyValueSet = propertyValueSetGenerator(properties);
    const sets = buildAllPropertyValueSets(propertyValueSet, properties, properties);
    assert.equal(sets.length, 16);
  });

});

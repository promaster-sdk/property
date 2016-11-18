import {assert} from 'chai';
import * as Units from "../../src/measure/units";
import * as Unit from "../../src/measure/unit";
import {VolumeFlowConversion} from "../test_utils/conversion_helpers/volume_flow_conversion";

describe('derived units', () => {

  it('Meter times Meter should return unit with 1 element of pow 2', () => {

    const newUnit = Unit.times("Length", Units.Meter, Units.Meter);
    if (newUnit.innerUnit.type === "product") {
      assert.equal(newUnit.innerUnit.elements.length, 1, "Wrong elements length");
      assert.equal(newUnit.innerUnit.elements[0].pow, 2, "Wrong pow");
    }
    else {
      assert.fail(newUnit.innerUnit.type, "product", "Expected the type of unit to be 'product'");
    }

  });

  it("CubicMeter by Second should return correct product unit", () => {

    const newUnit = Unit.divide("VolumeFlow", Units.CubicMeter, Units.Second);
    if (newUnit.innerUnit.type === "product") {
      assert.deepEqual(newUnit.innerUnit.elements, [
        {pow: 3, unit: {quantity: "Length", innerUnit: {type: "base", symbol: "m"}}},
        {pow: -1, unit: {quantity: "Duration", innerUnit: {type: "base", symbol: "s"}}},
      ], "Wrong elements");
    }
    else {
      assert.fail(newUnit.innerUnit.type, "product", "Expected the type of unit to be 'product'");
    }

  });

  it("CubicMeter by Hour should return correct product unit", () => {

    const newUnit = Unit.divide("VolumeFlow", Units.CubicMeter, Units.Hour);
    if (newUnit.innerUnit.type === "product") {
      assert.deepEqual(newUnit.innerUnit.elements, [
        {pow: 3, unit: {quantity: "Length", innerUnit: {type: "base", symbol: "m"}}},
        {
          pow: -1,
          unit: {
            quantity: "Duration",
            innerUnit: {
              type: "transformed",
              parentUnit: {
                quantity: "Duration",
                innerUnit: {
                  type: "transformed",
                  parentUnit: {
                    quantity: "Duration",
                    innerUnit: {type: "base", symbol: "s"}
                  },
                  toParentUnitConverter: {
                    type: "factor",
                    factor: 60
                  },
                }
              },
              toParentUnitConverter: {
                type: "factor",
                factor: 60
              }
            }
          }
        }
      ], "Wrong elements");
    }
    else {
      assert.fail(newUnit.innerUnit.type, "product", "Expected the type of unit to be 'product'");
    }

  });


});

describe('unit conversions', () => {


  it('For_Value_2_m3persec_we_should_get_value_7200_m3perhour', () => {
    const value = 2.0;
    const convertedValue: number = Unit.convert(value, Units.CubicMeterPerSecond, Units.CubicMeterPerHour);
    assert.closeTo(convertedValue, VolumeFlowConversion.M3PerSec2M3PerHour(value), 0.00001);
  });
});

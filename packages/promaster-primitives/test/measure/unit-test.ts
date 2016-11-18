import {assert} from 'chai';
import * as Units from "../../src/measure/units";
import * as Unit from "../../src/measure/unit";

describe('unit_tests', () => {

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

  it.only("CubicMeter by Second should return combined unit", () => {

    const newUnit = Unit.divide("VolumeFlow", Units.CubicMeter, Units.Second);
    if (newUnit.innerUnit.type === "product") {
      assert.deepEqual(newUnit.innerUnit.elements, [
        {
          pow: 3,
          unit: {
            quantity: "Length",
            innerUnit: {
              symbol: "m",
              type: "base"
            }
          },
        },
        {
          pow: -1,
          unit: {
            quantity: "Duration",
            innerUnit: {
              symbol: "s",
              type: "base"
            }
          },
        },
      ], "Wrong elements");

    }
    else {
      assert.fail(newUnit.innerUnit.type, "product", "Expected the type of unit to be 'product'");
    }

  });


});

import {assert} from 'chai';
import * as Units from "../../src/measure/units";
import * as Unit from "../../src/measure/unit";

describe('unit_tests', () => {

  it.only('Meter times Meter should return unit with 2 elements', () => {

    const newUnit =  Unit.times("Length", Units.Meter, Units.Meter);

    console.log("Units.Meter", Units.Meter);
    console.log("newUnit", newUnit);

    if(newUnit.innerUnit.type === "product") {
      assert.equal(newUnit.innerUnit.elements.length, 2);
    }
    else {
      assert.fail(newUnit.innerUnit.type, "product", "Expected the type of unit to be 'product'");
    }

  });

  it('CubicMeter divded by Second should return unit with 2 elements', () => {

    const newUnit =  Unit.divide("VolumeFlow", Units.CubicMeter, Units.Second);
    if(newUnit.innerUnit.type === "product") {
      assert.equal(newUnit.innerUnit.elements.length, 2);
    }
    else {
      assert.fail(newUnit.innerUnit.type, "product", "Expected the type of unit to be 'product'");
    }

  });


});

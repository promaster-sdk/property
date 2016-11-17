import {assert} from 'chai';
import {VolumeFlowConversion} from "../test_utils/conversion_helpers/volume_flow_conversion";
import * as Amount from "../../src/measure/amount";
import * as Units from "../../src/measure/units";
import * as UnitDivide from "../../src/measure/unit-divide";
import {InnerUnit, BaseUnit} from "../../src/measure/unit";

describe('unit_tests', () => {

  it.only('For CubicMeter divded by Second we should get a product unit with 2 elements', () => {
    // const value: number = 2.0;
    // const amountToTest = Amount.create(value, Units.CubicMeterPerSecond);
		//
    // console.log("Units.CubicMeterPerSecond", Units.CubicMeterPerSecond);
		//

    const b; BaseUnit<"VolumeFlow"> = {type: "base"};
    //const x: InnerUnit<"VolumeFlow"> =



    // const newUnit = UnitDivide.volumeByDuration(Units.CubicMeter, Units.Second);
    // const innerUnit = newUnit.innerUnit;
    // if(innerUnit.type !== "product") {
    //   assert.fail(newUnit.innerUnit.type, "product", "Expected the type of unit to be 'product'");
    // }
    // assert.equal(innerUnit.elements.length, 2);



		//
    // const convertedAmount: number = Amount.valueAs(Units.CubicMeterPerHour, amountToTest);
    // assert.closeTo(convertedAmount, VolumeFlowConversion.M3PerSec2M3PerHour(value), 0.00001);
  });


});

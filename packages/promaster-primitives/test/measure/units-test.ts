import {assert} from 'chai';
import * as Units from "../../src/measure/units";
import * as Unit from "../../src/measure/unit";

describe('units_test', () => {

	describe('getQuantityTypeFromString', () => {

		/*it('should not be case sensitive', () => {
			let length1 = Units.getQuantityTypeFromString("Length");
			let length2 = Units.getQuantityTypeFromString("length");
			assert.isTrue(length1 === length2);
		});*/

    /*it('getUnitsForQuantityshould not be case sensitive', () => {
      const unit = Units.getUnitsForQuantity("Length")[0];
      assert.isTrue(unit === Units.Meter);
    });*/

    /*it('Base should be eUnits not be case sensitive', () => {
     const unit = Units.getUnitsForQuantity("Length")[0];
     Units.Ampere
     assert.isTrue(unit === Units.Meter);
     });*/

	});

  describe.only('equals', () => {
    it('Base unit One should be equal', () => {
      const unit = Units.One;
      const unit2 = Units.getUnitFromString("One");
      assert.isTrue(Unit.equals(unit, unit2));
    });

    it('Alternate unit Radian should be equal', () => {
      const unit = Units.Radian;
      const unit2 = Units.getUnitFromString("Radian");
      assert.isTrue(Unit.equals(unit, unit2));
    });

    it('Product unit should be equal', () => {
      const unit = Unit.divide("Length", Units.Meter, Units.CentiMeter);
      const unit2 = Unit.divide("Length", Units.Meter, Units.CentiMeter);
      assert.isTrue(Unit.equals(unit, unit2));
    });

    it('Product unit should not be equal', () => {
      const unit = Unit.divide("Length", Units.Meter, Units.CentiMeter);
      const unit2 = Unit.divide("Length", Units.Meter, Units.Millimeter);
      assert.isFalse(Unit.equals(unit, unit2));
    });
  });

});
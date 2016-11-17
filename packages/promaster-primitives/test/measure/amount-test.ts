import {assert, expect} from "chai";
import {LengthConversion} from "../test_utils/conversion_helpers/length_conversion";
import {DurationConversion} from "../test_utils/conversion_helpers/duration_conversion";
import * as Amount from "../../src/measure/amount";
import * as Units from "../../src/measure/units";
import {Mass, Length, Energy, Temperature, Duration} from "../../src/measure/quantity";

describe('amount_test', () => {

	/*
	 it('hash_should_be_same_for_same_value', () => {
	 const a1 = new Amount<ITemperature>.create(4.0, Units.Celsius);
	 const a2 = new Amount<ITemperature>.create(4.0, Units.Celsius);
	 int hash1 = a1.hashCode;
	 int hash2 = a2.hashCode;
	 assert.equal(hash1 == hash2, true);
	 });
	 */

	it('should_not_accept_a_string_as_value', () => {
		const a: any = "12.3";
		expect(() => Amount.create(a, Units.Celsius)).to.throw();
	});

	it('should_not_accept_a_string_as_unit', () => {
		const a: any = "Celsius";
		expect(() => Amount.create(12.3, a)).to.throw();
	});

	it('should_not_accept_a_string_as_decimalCount', () => {
		const a: any = "12";
		expect(() => Amount.create(12.3, Units.Celsius, a)).to.throw();
	});

	it('Multiply_double_to_amount', () => {
		const valueLeft: number = 2.0;
		const valueRight: number = 5.5;
		const amountLeft = Amount.create(valueLeft, Units.Gram);
		const res1 = Amount.times(amountLeft, valueRight);
		assert.closeTo(valueLeft * valueRight, Amount.valueAs(Units.Gram, res1), 0.000001);
	});

	it('Divide_amount_by_double', () => {
		const valueLeft: number = 55.39;
		const valueRight: number = 58.456;
		const amountLeft = Amount.create(valueLeft, Units.Inch);
		const res1 = Amount.divide(amountLeft, valueRight);
		assert.closeTo(valueLeft / valueRight, Amount.valueAs(Units.Inch, res1), 0.00001);
	});

	it('Subtract_amounts_with_same_unit', () => {
		const valueLeft: number = 0.8;
		const valueRight: number = 99.56;
		const amountLeft = Amount.create(valueLeft, Units.Kilojoule);
		const amountRight = Amount.create(valueRight, Units.Kilojoule);
		const res1 = Amount.minus(amountLeft, amountRight);
		assert.closeTo(valueLeft - valueRight, Amount.valueAs(Units.Kilojoule, res1), 0.00001);
	});

	it('Add_amounts_with_same_unit', () => {
		const valueLeft: number = 12.8;
		const valueRight: number = 10.0;
		const amountLeft = Amount.create(valueLeft, Units.Inch);
		const amountRight = Amount.create(valueRight, Units.Inch);
		const res1 = Amount.plus(amountLeft, amountRight);
		assert.closeTo(valueLeft + valueRight, Amount.valueAs(Units.Inch, res1), 0.0001);
	});

	it('Add_amounts_with_different_units', () => {
		const valueLeft: number = 2.0;
		const valueRight: number = 5.5;
		const amountLeft = Amount.create(valueLeft, Units.Inch);
		const amountRight = Amount.create(valueRight, Units.CentiMeter);
		const res1 = Amount.plus(amountLeft, amountRight);
		assert.closeTo(valueLeft + LengthConversion.Cm2In(valueRight), Amount.valueAs(Units.Inch, res1), 0.0001);
	});

	it('Subtract_amounts_with_different_units', () => {
		const valueLeft: number = 360.0;
		const valueRight: number = 2.0;
		const amountLeft = Amount.create(valueLeft, Units.Second);
		const amountRight = Amount.create(valueRight, Units.Hour);
		const res1 = Amount.minus(amountLeft, amountRight);
		assert.closeTo(valueLeft - DurationConversion.H2S(valueRight), Amount.valueAs(Units.Second, res1), 0.00001);
	});

	it('Multiply_amount_to_double', () => {
		const valueLeft: number = 2.0;
		const valueRight: number = 5.5;
		const amountRight = Amount.create(valueRight, Units.Hour);
		const res1 = Amount.times(amountRight, valueLeft);
		assert.equal(valueLeft * valueRight, Amount.valueAs(Units.Hour, res1));
	});

	it('Create_Amount_And_Check_Explicit_Conversion', () => {
		const valueLeft: number = -568.25;
		const valueRight: number = 15.369852;
		const amountLeft = Amount.create(valueLeft, Units.Second);
		const amountRight = Amount.create(valueRight, Units.Hour);
		assert.closeTo(valueLeft, Amount.valueAs(Units.Second, amountLeft), 0.0001);
		assert.closeTo(valueRight, Amount.valueAs(Units.Hour, amountRight), 0.0001);
	});

	it('Operator_Equals', () => {
		const valueLeft = Amount.create(0.8, Units.Celsius);
		const valueRight = Amount.create(0.8, Units.Celsius);

		assert.equal(true, Amount.equals(valueLeft, valueRight));
	});

	it('should equal 1 m with 100 cm', () => {
		const valueLeft = Amount.create(1, Units.Meter);
		const valueRight = Amount.create(100, Units.CentiMeter);
		assert.equal(true, Amount.equals(valueLeft, valueRight));
	});

	it('Operator_GreaterThan', () => {
		const valueLeft = Amount.create(0.9, Units.Celsius);
		const valueRight = Amount.create(0.8, Units.Celsius);
		assert.equal(true, Amount.greaterThan(valueLeft, valueRight));
	});

	it('Operator_LessThan', () => {
		const valueLeft = Amount.create(0.8, Units.Celsius);
		const valueRight = Amount.create(0.9, Units.Celsius);
		assert.equal(true, Amount.lessThan(valueLeft, valueRight));
	});

	it('Operator_LessThanOrEquals', () => {
		const valueLeft = Amount.create(0.8, Units.Celsius);
		const valueRight = Amount.create(0.9, Units.Celsius);
		assert.equal(true, Amount.lessOrEqualTo(valueLeft, valueRight));
	});

	it('Operator_GreaterThanOrEquals', () => {
		const valueLeft = Amount.create(0.9, Units.Celsius);
		const valueRight = Amount.create(0.8, Units.Celsius);
		assert.equal(true, Amount.greaterOrEqualTo(valueLeft, valueRight));
	});

	/*
	 it('Tolerance_Result_Of_Substraction_Equals_Constant', () => {
	 const valueLeft = Amount.create(0.8, Units.Celsius);
	 const valueRight = Amount.create(0.7, Units.Celsius);
	 const result = valueLeft.minus(valueRight);

	 assert.equal(result, Amount.create(0.1, Units.Celsius));
	 });
	 */

	it('Operator_GraterThan_Positive_and_Negative', () => {
		const left = Amount.create(16.2, Units.Celsius);
		const right = Amount.create(-200.0, Units.Celsius);
		assert.equal(Amount.greaterThan(left, right), true);
	});

	it('Operator_LessThan_Negative_and_Positive', () => {
		const left = Amount.create(-200.0, Units.Celsius);
		const right = Amount.create(16.2, Units.Celsius);
		assert.equal(Amount.lessThan(left, right), true);
	});

	/*
	 it('Operator_Equals_Tolerance', () => {
	 const x1 = Amount.create(44000.000000000065, Units.Celsius);
	 const x2 = Amount.create(44000.000000000007, Units.Celsius);
	 assert.equal(x1 == x2, true);
	 });
	 */

	/*

	 const normal1:number = 0.0002777777777777701;
	 const normal2:number = 0.0002777777777777901;
	 const normal3:number = 0.0002777777777778300;

	 it('Test_Amount_Compare_SameRef_True', () => {
	 const a:Amount<IMassFlow> = Amount.exact<IMassFlow>(normal1, Units.KilogramPerSecond);
	 const b:Amount<IMassFlow> = a;

	 const compare:number = a.compareTo(b);
	 assert.equal(compare, 0);
	 });

	 it('Test_Amount_Compare_Null__True', () => {
	 Amount<IMassFlow> a = null;
	 Amount<IMassFlow> b = null;

	 assert.equal(a, b);
	 });

	 it('Test_Amount_Compare_Null_2_True', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (normal1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = null;

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });

	 it('Test_Amount_Compare_Normal_Normal_1_True', () => {

	 Amount<IMassFlow> a = new Amount<IMassFlow>.create(normal1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.create(normal2, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, 0);
	 });

	 it('Test_Amount_Compare_Normal_Normal_2_True', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (-normal1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (-normal2, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, 0);
	 });

	 it('Test_Amount_Compare_Normal_Normal_1_False', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (normal1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (normal3, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });

	 it('Test_Amount_Compare_Normal_Normal_2_False', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow> .exact (-normal1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (-normal3, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });

	 const double Normal10 = 2777777777777701.0;
	 const double Normal20 = 2777777777777710.0;
	 const double Normal30 = 2777777777778200.0;

	 it('Test_Amount_Compare_Normal10_Normal20_Positive', () => {
	 Amount<IMassFlow> a = new Amount< IMassFlow >.exact (Normal10, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount< IMassFlow >.exact (Normal20, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, 0);
	 });


	 it('Test_Amount_Compare_Normal10_Normal_20_Negative', () => {
	 Amount<IMassFlow> a = new Amount< IMassFlow > .exact (-Normal10, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount< IMassFlow > .exact (-Normal20, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, 0);
	 });

	 it('Test_Amount_Compare_Normal10_Normal30_Positive', () => {
	 Amount<IMassFlow> a = new Amount< IMassFlow >.exact (Normal10, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount< IMassFlow >.exact (Normal30, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });

	 it('Test_Amount_Compare_Normal10_Normal30_Negative', () => {
	 Amount<IMassFlow> a = new Amount< IMassFlow >.exact (-Normal10, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount< IMassFlow > .exact (-Normal30, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });

	 const double zero0 = 0.0;
	 const double zero1 = 0.0000000000000000077;
	 const double zero2 = 0.0000000000000000079;
	 const double zero3 = 0.0000000000000000080;

	 it('Test_Amount_Compare_Zero0_Zero0_Positive', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (zero0, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (zero0, Units.KilogramPerSecond);
	 int compare = a.compareTo(b);
	 assert.equal(compare, 0);
	 });


	 it('Test_Amount_Compare_Zero0_Zero0_Negative', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (-zero0, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (-zero0, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, 0);
	 });


	 it('Test_Amount_Compare_Zero1_Zero2_Positive', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (zero1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (zero2, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });


	 it('Test_Amount_Compare_Zero1_Zero2_Negative', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (-zero1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (-zero2, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });

	 it('Test_Amount_Compare_Zero1_Zero3_Positive', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (zero1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (zero3, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });

	 it('Test_Amount_Compare_Zero1_Zero3_Negative', () => {
	 Amount<IMassFlow> a = new Amount<IMassFlow>.exact (-zero1, Units.KilogramPerSecond);
	 Amount<IMassFlow> b = new Amount<IMassFlow>.exact (-zero3, Units.KilogramPerSecond);

	 int compare = a.compareTo(b);
	 assert.equal(compare, isNot(0));
	 });
	 */

});

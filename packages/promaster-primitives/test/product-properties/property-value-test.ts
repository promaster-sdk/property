import {assert} from 'chai';
import * as PropertyValue from "../../src/product-properties/property-value";
import * as Amount from "../../src/measure/amount";
import * as Units from "../../src/measure/units";

describe('property_value_test', () => {
  it('should_parse_amount_with_decimal_dot', () => {
    const pv1 = PropertyValue.fromString("2.1:Celsius");
    const amount1 = PropertyValue.getAmount(pv1);
    const amount2 = Amount.create(2.1, Units.Celsius, 1);
    assert.equal(Amount.equals(amount1, amount2), true);
  });

  it('should_parse_integer', () => {
    const pv1 = PropertyValue.fromString("2");
    assert.equal(PropertyValue.getInteger(pv1), 2);
  });

  it('should_parse_text', () => {
    var pv1 = PropertyValue.fromString('"Olle"');
    assert.equal(PropertyValue.getText(pv1), "Olle");
  });

  it('should_do_value_compare_integer_with_equals_method', () => {
    var pv1 = PropertyValue.fromInteger(2);
    var pv2 = PropertyValue.fromInteger(2);
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it('should_do_value_compare_amount_with_equals_method', () => {
    var pv1 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    var pv2 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it('should_do_value_compare_string_with_equals_method', () => {
    var pv1 = PropertyValue.fromText("abcABC");
    var pv2 = PropertyValue.fromText("abcABC");
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it('should_do_value_compare_integer_with_equality_operator', () => {
    var pv1 = PropertyValue.fromInteger(2);
    var pv2 = PropertyValue.fromInteger(2);
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it('should_do_value_compare_amount_with_equality_operator', () => {
    var pv1 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    var pv2 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it('should_do_value_compare_string_with_equality_operator', () => {
    var pv1 = PropertyValue.fromText("abcABC");
    var pv2 = PropertyValue.fromText("abcABC");
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it('should_parse_string_in_quotes_same_as_explicit_text_constructor', () => {
    var pv1 = PropertyValue.fromString("\"abcABC\"");
    var pv2 = PropertyValue.fromText("abcABC");
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it('should_parse_amount_string_with_two_decimals_to_amount_with_two_decimals', () => {
    var pv1 = PropertyValue.fromString("12.34:Celsius");
    var amount = PropertyValue.getAmount(pv1);
    assert.equal(amount.decimalCount, 2);
  });

  it('should_parse_amount_string_with_one_decimal_to_amount_with_one_decimal', () => {
    var pv1 = PropertyValue.fromString("532.5:Watt");
    var amount = PropertyValue.getAmount(pv1);
    assert.equal(amount.decimalCount, 1);
  });

  it('should_parse_amount_string_with_zero_decimals_to_amount_with_zero_decimals', () => {
    var pv1 = PropertyValue.fromString("532:Inch");
    var amount = PropertyValue.getAmount(pv1);
    assert.equal(amount.decimalCount, 0);
  });

  it('should_parse_empty_string_to_property_value_of_type_text', () => {
    var pv1 = PropertyValue.fromString("");
    assert.equal(pv1.type, "text");
  });

  it('should_give_undefined_if_type_is_not_matching', () => {
    const pv1 = PropertyValue.fromString("10:Celsius");
    assert.equal(PropertyValue.getInteger(pv1), undefined);
  });

  it('should_compare_integers_correctly1', () => {
    const pv1 = PropertyValue.fromString("2");
    const pv2 = PropertyValue.fromString("3");
    assert.equal(PropertyValue.compareTo(pv1, pv2) < 0, true);
  });

  it('should_compare_integers_correctly2', () => {
    const pv2 = PropertyValue.fromString("3");
    const pv3 = PropertyValue.fromString("3");
    assert.equal(PropertyValue.compareTo(pv2, pv3) === 0, true);
  });

  it('should_compare_integers_correctly3', () => {
    const pv1 = PropertyValue.fromString("2");
    const pv3 = PropertyValue.fromString("3");
    assert.equal(PropertyValue.compareTo(pv3, pv1) > 0, true);
  });

  it('should make a correct string from an amount value', () => {
    const pv1 = PropertyValue.fromString("20.03:Celsius");
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, "20.03:celsius");
  });

  it('should make a correct string from an integer value', () => {
    const pv1 = PropertyValue.fromInteger(123);
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, "123");
  });

  it('should make a correct string from an text value', () => {
    const pv1 = PropertyValue.fromText("TextValue");
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, '"TextValue"');
  });

});

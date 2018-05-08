import { assert } from "chai";
import { Units, Amount, Quantity } from "@promaster/uom";
import * as PropertyValue from "../../src/property-value";

describe("PropertyValue", () => {
  it("should_parse_amount_with_decimal_dot", () => {
    const pv1 = fromStringOrException("2.1:Celsius");
    const amount1 = getAmountOrException(pv1);
    const amount2 = Amount.create(2.1, Units.Celsius, 1);
    assert.equal(Amount.equals(amount1, amount2), true);
  });

  it("should_parse_integer", () => {
    const pv1 = fromStringOrException("2");
    assert.equal(PropertyValue.getInteger(pv1), 2);
  });

  it("should_parse_text", () => {
    const pv1 = fromStringOrException('"Olle"');
    assert.equal(PropertyValue.getText(pv1), "Olle");
  });

  it("should_do_value_compare_integer_with_equals_method", () => {
    const pv1 = PropertyValue.fromInteger(2);
    const pv2 = PropertyValue.fromInteger(2);
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it("should_do_value_compare_amount_with_equals_method", () => {
    const pv1 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    const pv2 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it("should_do_value_compare_string_with_equals_method", () => {
    const pv1 = PropertyValue.fromText("abcABC");
    const pv2 = PropertyValue.fromText("abcABC");
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it("should_do_value_compare_integer_with_equality_operator", () => {
    const pv1 = PropertyValue.fromInteger(2);
    const pv2 = PropertyValue.fromInteger(2);
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it("should_do_value_compare_amount_with_equality_operator", () => {
    const pv1 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    const pv2 = PropertyValue.fromAmount(Amount.create(2.0, Units.Celsius));
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it("should_do_value_compare_string_with_equality_operator", () => {
    const pv1 = PropertyValue.fromText("abcABC");
    const pv2 = PropertyValue.fromText("abcABC");
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it("should_parse_string_in_quotes_same_as_explicit_text_constructor", () => {
    const pv1 = fromStringOrException('"abcABC"');
    const pv2 = PropertyValue.fromText("abcABC");
    assert.equal(PropertyValue.equals(pv1, pv2), true);
  });

  it("should_not_compare_values_of_different_types_and_return_false", () => {
    const pv1 = PropertyValue.fromInteger(0);
    const pv2 = PropertyValue.fromText("abcABC");
    assert.isFalse(PropertyValue.equals(pv1, pv2));
  });

  it("should_parse_amount_string_with_two_decimals_to_amount_with_two_decimals", () => {
    const pv1 = fromStringOrException("12.34:Celsius");
    const amount = getAmountOrException(pv1);
    assert.equal(amount.decimalCount, 2);
  });

  it("should_parse_amount_string_with_one_decimal_to_amount_with_one_decimal", () => {
    const pv1 = fromStringOrException("532.5:Watt");
    const amount = getAmountOrException(pv1);
    assert.equal(amount.decimalCount, 1);
  });

  it("should_parse_amount_string_with_zero_decimals_to_amount_with_zero_decimals", () => {
    const pv1 = fromStringOrException("532:Inch");
    const amount = getAmountOrException(pv1);
    assert.equal(amount.decimalCount, 0);
  });

  it("should_parse_empty_string_to_property_value_of_type_text", () => {
    const pv1 = fromStringOrException("");
    assert.equal(pv1.type, "text");
  });

  it("should_give_undefined_if_type_is_not_matching", () => {
    const pv1 = fromStringOrException("10:Celsius");
    assert.equal(PropertyValue.getInteger(pv1), undefined);
  });

  it("should_compare_integers_correctly1", () => {
    const pv1 = fromStringOrException("2");
    const pv2 = fromStringOrException("3");
    assert.equal(PropertyValue.compareTo(pv1, pv2) < 0, true);
  });

  it("should_compare_integers_correctly2", () => {
    const pv2 = fromStringOrException("3");
    const pv3 = fromStringOrException("3");
    assert.equal(PropertyValue.compareTo(pv2, pv3) === 0, true);
  });

  it("should_compare_integers_correctly3", () => {
    const pv1 = fromStringOrException("2");
    const pv3 = fromStringOrException("3");
    assert.equal(PropertyValue.compareTo(pv3, pv1) > 0, true);
  });

  it("should make a correct string from an amount value", () => {
    const pv1 = fromStringOrException("20.03:Celsius");
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, "20.03:celsius");
  });

  it("should make a correct string from an integer value", () => {
    const pv1 = PropertyValue.fromInteger(123);
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, "123");
  });

  it("should make a correct string from an text value", () => {
    const pv1 = PropertyValue.fromText("TextValue");
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, '"TextValue"');
  });

  it("should make a correct string from an text value", () => {
    const pv1 = PropertyValue.fromText("TextValue");
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, '"TextValue"');
  });

  it("should make an empty string when amount value is null", () => {
    const amount = Amount.create(0, Units.Ampere, 1);
    (amount as any).value = null; //tslint:disable-line
    const pv1 = PropertyValue.fromAmount(amount);
    const pv1string = PropertyValue.toString(pv1);
    assert.equal(pv1string, "");
  });

  it("should make an empty string when amount value is null", () => {
    const pv1 = PropertyValue.fromString("20:PercentHumidity");
    if (pv1 === undefined || pv1.type !== "amount") {
      throw new Error("Bla");
    }
    assert(pv1.value.unit.quantity === "RelativeHumidity");
  });
});

describe("PropertyValue.greaterOrEqualTo", () => {
  it("should assert false for 0:CubicMeterPerSecond >= 16:CubicMeterPerHour", () => {
    const pv1 = fromStringOrException("0:CubicMeterPerSecond");
    const pv2 = fromStringOrException("16:CubicMeterPerHour");
    assert.equal(PropertyValue.greaterOrEqualTo(pv1, pv2), false);
  });
});

function fromStringOrException(
  encodedValue: string
): PropertyValue.PropertyValue {
  const f = PropertyValue.fromString(encodedValue);
  if (f === undefined) {
    throw new Error(`Could not parse property value "${encodedValue}".`);
  }
  return f;
}

function getAmountOrException<T extends Quantity.Quantity>(
  value: PropertyValue.PropertyValue
): Amount.Amount<T> {
  const f = PropertyValue.getAmount(value);
  if (f === undefined) {
    throw new Error(`Could not get amount from property value "${value}".`);
  }
  return f;
}

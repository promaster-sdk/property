import { Amount, BaseUnits, Unit } from "uom";
import * as PropertyValue from "../property-value";

const unitLookup: Unit.UnitLookup = unitString =>
  (BaseUnits as Unit.UnitMap)[unitString];

describe("PropertyValue", () => {
  it("should_parse_amount_with_decimal_dot", () => {
    const pv1 = fromStringOrException("2.1:Meter");
    const amount1 = getAmountOrException(pv1);
    const amount2 = Amount.create(2.1, BaseUnits.Meter, 1);
    expect(Amount.equals(amount1, amount2)).toBe(true);
  });

  it("should_parse_integer", () => {
    const pv1 = fromStringOrException("2");
    expect(PropertyValue.getInteger(pv1)).toBe(2);
  });

  it("should_parse_text", () => {
    const pv1 = fromStringOrException('"Olle"');
    expect(PropertyValue.getText(pv1)).toBe("Olle");
  });

  it("should_do_value_compare_integer_with_equals_method", () => {
    const pv1 = PropertyValue.fromInteger(2);
    const pv2 = PropertyValue.fromInteger(2);
    expect(PropertyValue.equals(pv1, pv2)).toBe(true);
  });

  it("should_do_value_compare_amount_with_equals_method", () => {
    const pv1 = PropertyValue.fromAmount(Amount.create(2.0, BaseUnits.Meter));
    const pv2 = PropertyValue.fromAmount(Amount.create(2.0, BaseUnits.Meter));
    expect(PropertyValue.equals(pv1, pv2)).toBe(true);
  });

  it("should_do_value_compare_string_with_equals_method", () => {
    const pv1 = PropertyValue.fromText("abcABC");
    const pv2 = PropertyValue.fromText("abcABC");
    expect(PropertyValue.equals(pv1, pv2)).toBe(true);
  });

  it("should_do_value_compare_integer_with_equality_operator", () => {
    const pv1 = PropertyValue.fromInteger(2);
    const pv2 = PropertyValue.fromInteger(2);
    expect(PropertyValue.equals(pv1, pv2)).toBe(true);
  });

  it("should_do_value_compare_amount_with_equality_operator", () => {
    const pv1 = PropertyValue.fromAmount(Amount.create(2.0, BaseUnits.Meter));
    const pv2 = PropertyValue.fromAmount(Amount.create(2.0, BaseUnits.Meter));
    expect(PropertyValue.equals(pv1, pv2)).toBe(true);
  });

  it("should_do_value_compare_string_with_equality_operator", () => {
    const pv1 = PropertyValue.fromText("abcABC");
    const pv2 = PropertyValue.fromText("abcABC");
    expect(PropertyValue.equals(pv1, pv2)).toBe(true);
  });

  it("should_parse_string_in_quotes_same_as_explicit_text_constructor", () => {
    const pv1 = fromStringOrException('"abcABC"');
    const pv2 = PropertyValue.fromText("abcABC");
    expect(PropertyValue.equals(pv1, pv2)).toBe(true);
  });

  it("should_not_compare_values_of_different_types_and_return_false", () => {
    const pv1 = PropertyValue.fromInteger(0);
    const pv2 = PropertyValue.fromText("abcABC");
    expect(PropertyValue.equals(pv1, pv2)).toBe(false);
  });

  it("should_parse_amount_string_with_two_decimals_to_amount_with_two_decimals", () => {
    const pv1 = fromStringOrException("12.34:Meter");
    const amount = getAmountOrException(pv1);
    expect(amount.decimalCount).toBe(2);
  });

  it("should_parse_amount_string_with_one_decimal_to_amount_with_one_decimal", () => {
    const pv1 = fromStringOrException("532.5:Meter");
    const amount = getAmountOrException(pv1);
    expect(amount.decimalCount).toBe(1);
  });

  it("should_parse_amount_string_with_zero_decimals_to_amount_with_zero_decimals", () => {
    const pv1 = fromStringOrException("532:Meter");
    const amount = getAmountOrException(pv1);
    expect(amount.decimalCount).toBe(0);
  });

  it("should_parse_empty_string_to_property_value_of_type_text", () => {
    const pv1 = fromStringOrException("");
    expect(pv1.type).toBe("text");
  });

  it("should_give_undefined_if_type_is_not_matching", () => {
    const pv1 = fromStringOrException("10:Meter");
    expect(PropertyValue.getInteger(pv1)).toBe(undefined);
  });

  it("should_compare_integers_correctly1", () => {
    const pv1 = fromStringOrException("2");
    const pv2 = fromStringOrException("3");
    expect(PropertyValue.defaultComparer(pv1, pv2) < 0).toBe(true);
  });

  it("should_compare_integers_correctly2", () => {
    const pv2 = fromStringOrException("3");
    const pv3 = fromStringOrException("3");
    expect(PropertyValue.defaultComparer(pv2, pv3) === 0).toBe(true);
  });

  it("should_compare_integers_correctly3", () => {
    const pv1 = fromStringOrException("2");
    const pv3 = fromStringOrException("3");
    expect(PropertyValue.defaultComparer(pv3, pv1) > 0).toBe(true);
  });

  it("should make a correct string from an amount value", () => {
    const pv1 = fromStringOrException("20.03:Meter");
    const pv1string = PropertyValue.toString(pv1);
    expect(pv1string).toBe("20.03:Meter");
  });

  it("should make a correct string from an integer value", () => {
    const pv1 = PropertyValue.fromInteger(123);
    const pv1string = PropertyValue.toString(pv1);
    expect(pv1string).toBe("123");
  });

  it("should make a correct string from an text value", () => {
    const pv1 = PropertyValue.fromText("TextValue");
    const pv1string = PropertyValue.toString(pv1);
    expect(pv1string).toBe('"TextValue"');
  });

  it("should make a correct string from an text value", () => {
    const pv1 = PropertyValue.fromText("TextValue");
    const pv1string = PropertyValue.toString(pv1);
    expect(pv1string).toBe('"TextValue"');
  });

  it("should make an empty string when amount value is null", () => {
    const amount = Amount.create(0, BaseUnits.Ampere, 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (amount as any).value = null;
    const pv1 = PropertyValue.fromAmount(amount);
    const pv1string = PropertyValue.toString(pv1);
    expect(pv1string).toBe("");
  });

  it("should make an empty string when amount value is null", () => {
    const pv1 = PropertyValue.fromString("20:Meter", unitLookup);
    if (pv1 === undefined || pv1.type !== "amount") {
      throw new Error("Bla");
    }
    expect(pv1.value.unit.quantity === "Length").toBe(true);
  });

  it("custom_comparer_equals", () => {
    const pv1 = PropertyValue.fromAmount(Amount.create(100, BaseUnits.Meter));
    const pv2 = PropertyValue.fromAmount(Amount.create(1234, BaseUnits.Meter));

    const pv3 = PropertyValue.fromInteger(1);
    const pv4 = PropertyValue.fromInteger(555);

    const pv5 = PropertyValue.fromText("123");
    const pv6 = PropertyValue.fromText("pineapple");

    const comparer = (): number => 0;

    expect(PropertyValue.equals(pv1, pv2, comparer)).toBe(true);
    expect(PropertyValue.equals(pv3, pv4, comparer)).toBe(true);
    expect(PropertyValue.equals(pv5, pv6, comparer)).toBe(true);
  });

  it("custom_comparer_less_than", () => {
    const pv1 = PropertyValue.fromAmount(Amount.create(100, BaseUnits.Meter));
    const pv2 = PropertyValue.fromAmount(Amount.create(100, BaseUnits.Meter));

    const pv3 = PropertyValue.fromInteger(8);
    const pv4 = PropertyValue.fromInteger(8);

    const pv5 = PropertyValue.fromText("Hydralisk");
    const pv6 = PropertyValue.fromText("Hydralisk");

    const comparer = (): number => -1;

    expect(PropertyValue.lessThan(pv1, pv2, comparer)).toBe(true);
    expect(PropertyValue.lessThan(pv3, pv4, comparer)).toBe(true);
    expect(PropertyValue.lessThan(pv5, pv6, comparer)).toBe(true);

    expect(PropertyValue.lessOrEqualTo(pv1, pv2, comparer)).toBe(true);
    expect(PropertyValue.lessOrEqualTo(pv3, pv4, comparer)).toBe(true);
    expect(PropertyValue.lessOrEqualTo(pv5, pv6, comparer)).toBe(true);
  });

  it("custom_comparer_greater_than", () => {
    const pv1 = PropertyValue.fromAmount(Amount.create(100, BaseUnits.Meter));
    const pv2 = PropertyValue.fromAmount(Amount.create(100, BaseUnits.Meter));

    const pv3 = PropertyValue.fromInteger(8);
    const pv4 = PropertyValue.fromInteger(8);

    const pv5 = PropertyValue.fromText("Hydralisk");
    const pv6 = PropertyValue.fromText("Hydralisk");

    const comparer = (): number => 1;

    expect(PropertyValue.greaterThan(pv1, pv2, comparer)).toBe(true);
    expect(PropertyValue.greaterThan(pv3, pv4, comparer)).toBe(true);
    expect(PropertyValue.greaterThan(pv5, pv6, comparer)).toBe(true);

    expect(PropertyValue.greaterOrEqualTo(pv1, pv2, comparer)).toBe(true);
    expect(PropertyValue.greaterOrEqualTo(pv3, pv4, comparer)).toBe(true);
    expect(PropertyValue.greaterOrEqualTo(pv5, pv6, comparer)).toBe(true);
  });
});

describe("PropertyValue.greaterOrEqualTo", () => {
  it("should assert false for 0:Meter >= 16:Meter", () => {
    const pv1 = fromStringOrException("0:Meter");
    const pv2 = fromStringOrException("16:Meter");
    expect(PropertyValue.greaterOrEqualTo(pv1, pv2)).toBe(false);
  });
});

function fromStringOrException(
  encodedValue: string
): PropertyValue.PropertyValue {
  const f = PropertyValue.fromString(encodedValue, unitLookup);
  if (f === undefined) {
    throw new Error(`Could not parse property value "${encodedValue}".`);
  }
  return f;
}

function getAmountOrException<T>(
  value: PropertyValue.PropertyValue
): Amount.Amount<T> {
  const f = PropertyValue.getAmount<T>(value);
  if (f === undefined) {
    throw new Error(`Could not get amount from property value "${value}".`);
  }
  return f;
}

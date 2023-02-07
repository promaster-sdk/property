import { Amount, Unit, UnitMap, Serialize } from "uom";
import { compareNumbers, compareIgnoreCase } from "./utils/compare-utils";

// Types

export type PropertyType = "amount" | "text" | "integer";

export interface AmountPropertyValue {
  readonly type: "amount";
  readonly value: Amount.Amount<unknown>;
}

export interface TextPropertyValue {
  readonly type: "text";
  readonly value: string;
}

export interface IntegerPropertyValue {
  readonly type: "integer";
  readonly value: number;
}

export type PropertyValue = AmountPropertyValue | TextPropertyValue | IntegerPropertyValue;

export type Comparer = (left: PropertyValue, right: PropertyValue) => number;

export const defaultComparer: Comparer = (left: PropertyValue, right: PropertyValue) => _compare(left, right);

// Functions

export function create(type: PropertyType, value: Amount.Amount<unknown> | string | number): PropertyValue {
  if (type === undefined || type === null) {
    throw new Error("Argument 'type' must be specified.");
  }
  if (value === undefined || value === null) {
    throw new Error("Argument 'value' must be specified.");
  }
  if (type === "amount") {
    return { type: "amount", value: value as Amount.Amount<unknown> };
  }
  if (type === "text") {
    return { type: "text", value: value as string };
  }
  if (type === "integer") {
    return { type: "integer", value: value as number };
  }
  throw new Error(`Unknown 'type' ${type}.`);
}

export function fromString(encodedValue: string, unitLookup: UnitMap.UnitLookup): PropertyValue | undefined {
  const result = _fromSerializedStringOrUndefinedIfInvalidString(encodedValue, unitLookup);
  if (result === undefined) {
    console.warn(`PropertyValue.fromString(): Could not parse encoded value: '${encodedValue}'`);
  }
  return result;
}

export function fromAmount(amountValue: Amount.Amount<unknown>): PropertyValue {
  if (!amountValue) {
    throw new Error("null: value");
  }
  if (amountValue.unit.quantity === "Discrete") {
    return {
      type: "integer",
      value: amountValue.value,
    };
  } else {
    return { type: "amount", value: amountValue };
  }
}

/// NOTE: The string value should *NOT* be encoded in any way (such as being enclosed in
/// quotation marks or having quotation marks encoded as %22). If you want to create
/// a value from a string that is encoded then use the Parse() or TryParse() methods instead.
export function fromText(textValue: string): PropertyValue {
  if (textValue === null) {
    throw new Error("value");
  }
  return { type: "text", value: textValue } as PropertyValue;
}

export function fromInteger(integerValue: number): PropertyValue {
  return { type: "integer", value: integerValue } as PropertyValue;
}

export function getInteger(value: PropertyValue): number | undefined {
  if (value.type === "integer") {
    return value.value;
  } else {
    return undefined;
  }
}

export function getAmount<T>(value: PropertyValue): Amount.Amount<T> | undefined {
  if (value.type === "amount") {
    return value.value as Amount.Amount<T>;
  } else {
    return undefined;
  }
}

export function getText(value: PropertyValue): string | undefined {
  if (value.type === "text") {
    return value.value as string;
  } else {
    return undefined;
  }
}

export function valueAs<T>(unit: Unit.Unit<T>, value: PropertyValue): number | undefined {
  const amount = getAmount<T>(value);
  if (amount === undefined) {
    return undefined;
  }
  const value2: number = Amount.valueAs(unit, amount);
  return value2;
}

export function toString(value: PropertyValue): string {
  if (value.type === "amount") {
    if (value.value.value === null || value.value.value === undefined) {
      return "";
    }

    const valueString = value.value.value.toFixed(Math.min(20, value.value.decimalCount));
    const unitString = Serialize.unitToString(value.value.unit);
    return `${valueString}:${unitString}`;
  } else if (value.type === "text") {
    return _encodeToSafeString(value.value);
  } else if (value.type === "integer") {
    return value.value.toString();
  }
  throw new Error("Invalid type.");
}

export function equals(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) === 0;
}

export function lessThan(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) < 0;
}

export function lessOrEqualTo(
  left: PropertyValue,
  right: PropertyValue,
  comparer: Comparer = defaultComparer
): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) <= 0;
}

export function greaterThan(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) > 0;
}

export function greaterOrEqualTo(
  left: PropertyValue,
  right: PropertyValue,
  comparer: Comparer = defaultComparer
): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) >= 0;
}

function _compare(left: PropertyValue, right: PropertyValue): number {
  switch (left.type) {
    case "integer":
      if (right.type === "integer") {
        return compareNumbers(left.value, right.value, 0, 0);
      }
      throw new Error("Unexpected error comparing integers");
    case "amount":
      if (right.type === "amount") {
        return Amount.compareTo(left.value, right.value);
      }
      throw new Error("Unexpected error comparing amounts");
    case "text":
      if (right.type === "text") {
        return compareIgnoreCase(left.value, right.value);
      }
      throw new Error("Unexpected error comparing texts");
    default:
      throw new Error("Unknown property type");
  }
}

/// RULES:
///
/// Strings-values *MUST* be enclosed in double quote (") and if they contains
/// double quote (") characters they *MUST* be encoded as %22.
/// No other encodings are supported.
///
/// Integer-values should not be enclosed in quotation marks.
///
/// Amount-values must be in format Value:Unit without quotation marks.
function _fromSerializedStringOrUndefinedIfInvalidString(
  encodedValue: string,
  unitLookup: UnitMap.UnitLookup
): PropertyValue | undefined {
  if (encodedValue === "") {
    return fromText("");
  }
  if (encodedValue === null) {
    return undefined;
  }
  let deserializedValue: PropertyValue;
  if (encodedValue.startsWith('"') && encodedValue.endsWith('"')) {
    const valueString = _decodeFromSafeString(encodedValue);
    deserializedValue = fromText(valueString);
  } else if (encodedValue.indexOf(":") !== -1) {
    const split2 = encodedValue.split(":");
    const unitString = split2[1];
    if (unitString.toLowerCase() === "integer") {
      const integerValue: number = parseInt(split2[0], 10);
      if (integerValue === null) {
        return undefined;
      }
      deserializedValue = fromInteger(integerValue);
    } else {
      const stringValue = split2[0];
      const doubleValue: number = parseFloat(stringValue);
      if (doubleValue === null) {
        return undefined;
      }
      if (!Serialize.stringToUnit(unitString, unitLookup)) {
        return undefined;
      }
      const unit = Serialize.stringToUnit(unitString, unitLookup);
      let decimalCount = 0;
      const pointIndex = stringValue.indexOf(".");
      if (pointIndex >= 0) {
        decimalCount = stringValue.length - pointIndex - 1;
      }
      if (unit) {
        const amount = Amount.create(doubleValue, unit, decimalCount);
        deserializedValue = fromAmount(amount);
      } else {
        return undefined;
      }
    }
  } else {
    const integerValue: number = parseInt(encodedValue, 10);
    if (!Number.isInteger(integerValue)) {
      return undefined;
    }
    deserializedValue = fromInteger(integerValue);
  }
  return deserializedValue;
}

function _encodeToSafeString(unsafeString: string | null): string {
  // We use '"' to enclose a string so it must be encoded as %22 inside strings
  if (unsafeString === null) {
    return "";
  }
  let safeString = unsafeString;
  safeString = safeString.replace(/"/g, "%22");
  return '"' + safeString + '"';
}

function _decodeFromSafeString(safeString: string): string {
  // We use '"' to enclose a string so it must be encoded as %22 inside strings
  //    var unsafeString = safeString.Trim('"');
  let unsafeString = safeString;
  while (unsafeString.length > 0 && unsafeString.startsWith('"')) {
    unsafeString = unsafeString.substring(1);
  }
  while (unsafeString.length > 0 && unsafeString.endsWith('"')) {
    unsafeString = unsafeString.substring(0, unsafeString.length - 1);
  }

  unsafeString = unsafeString.replace(/%22/g, '"');

  //// **** OBSOLETE BEGIN - WE ONLY SUPPORT DECODING OF THESE CHARS FOR BACKWARDS COMPABILITY ****
  //unsafeString = unsafeString.replaceAll(/%3B/g, ";");
  //unsafeString = unsafeString.replaceAll(/%3D/g, "=");
  //unsafeString = unsafeString.replaceAll(/%3A/g, ":");
  //// **** OBSOLETE END ****

  return unsafeString;
}

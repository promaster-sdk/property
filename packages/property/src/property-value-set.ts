import { Amount, UnitMap } from "uom";
// eslint-disable-next-line import/no-duplicates
import * as PropertyValue from "./property-value";
// eslint-disable-next-line import/no-duplicates
import { PropertyType } from "./property-value";

// Types

/// Represents a set of properties and a selected value for each of the properties.
export interface PropertyValueSet {
  readonly [key: string]: PropertyValue.PropertyValue;
}

export interface PropertyKeyValuePair {
  readonly key: string;
  readonly value: PropertyValue.PropertyValue;
}

export const Empty: PropertyValueSet = {};

// For internal use only
interface MutablePropertyValueSet {
  [key: string]: PropertyValue.PropertyValue; //eslint-disable-line
}

// Functions

export function fromString(encodedValueSet: string, unitLookup: UnitMap.UnitLookup): PropertyValueSet {
  const err = (): PropertyValueSet => {
    throw new Error(`${encodedValueSet} is not a valid PropertyValueSet`);
  };
  return fromStringOrError(err, encodedValueSet, unitLookup);
}

export function fromStringOrError(
  onError: (encodedValueSet: string) => PropertyValueSet,
  encodedValueSet: string,
  unitLookup: UnitMap.UnitLookup
): PropertyValueSet {
  if (!encodedValueSet || encodedValueSet.length === 0) {
    return {};
  }
  const entries = _stringToEntriesOrUndefinedIfInvalidString(encodedValueSet, unitLookup);
  if (entries === undefined) {
    return onError(encodedValueSet);
  } else {
    return entries;
  }
}

export function fromProperty(propertyName: string, propertyValue: PropertyValue.PropertyValue): PropertyValueSet {
  return {
    [propertyName]: propertyValue,
  };
}

export function isEmpty(propertyValueSet: PropertyValueSet | null | undefined): boolean {
  return !propertyValueSet || count(propertyValueSet) === 0;
}

export function count(pvs: PropertyValueSet): number {
  return Object.keys(pvs).length;
}

export function get(propertyName: string, pvs: PropertyValueSet): PropertyValue.PropertyValue | undefined {
  // eslint-disable-next-line no-prototype-builtins
  if (!pvs.hasOwnProperty(propertyName)) {
    return undefined;
  }
  return pvs[propertyName];
}

export function hasProperty(propertyName: string, pvs: PropertyValueSet): boolean {
  // eslint-disable-next-line no-prototype-builtins
  return pvs.hasOwnProperty(propertyName);
}

export function getPropertyNames(pvs: PropertyValueSet): Array<string> {
  return Object.keys(pvs);
}

export function merge(mergeWith: PropertyValueSet, pvs: PropertyValueSet): PropertyValueSet {
  //return amend(set, mergeWith);
  return { ...pvs, ...mergeWith };
}

/// If a property exists with the same name in the PropertyValueSet as in the
// replacement set then the value of that property will be replaced.
export function setValues(replacementSet: PropertyValueSet, pvs: PropertyValueSet): PropertyValueSet {
  //return amend(set, replacementSet);
  return { ...pvs, ...replacementSet };
}

export function set(
  propertyName: string,
  propertyValue: PropertyValue.PropertyValue,
  pvs: PropertyValueSet
): PropertyValueSet {
  return amendProperty(pvs, propertyName, propertyValue);
}

export function setAmount<T>(
  propertyName: string,
  amountValue: Amount.Amount<T>,
  pvs: PropertyValueSet
): PropertyValueSet {
  return amendProperty(pvs, propertyName, PropertyValue.fromAmount(amountValue));
}

export function setInteger(propertyName: string, integerValue: number, pvs: PropertyValueSet): PropertyValueSet {
  return amendProperty(pvs, propertyName, PropertyValue.fromInteger(integerValue));
}

export function setText(propertyName: string, textValue: string, pvs: PropertyValueSet): PropertyValueSet {
  return amendProperty(pvs, propertyName, PropertyValue.fromText(textValue));
}

/**
 * Only keep properties whos name exist in the propertyNames array
 * @param propertyNames Array of propertyNames to keep
 * @param pvs PropertyValueSet to strip unwanted properties from
 */
export function keepProperties(propertyNames: Array<string>, pvs: PropertyValueSet): PropertyValueSet {
  const newSet: MutablePropertyValueSet = {};
  for (const name of propertyNames) {
    if (pvs[name]) {
      // Don't create properties that doesn't exist
      newSet[name] = pvs[name];
    }
  }
  return newSet;
}

export function removeProperties(propertyNames: Array<string>, pvs: PropertyValueSet): PropertyValueSet {
  const newSet: MutablePropertyValueSet = {};
  for (const name of Object.keys(pvs)) {
    if (propertyNames.indexOf(name) === -1) {
      newSet[name] = pvs[name];
    }
  }
  return newSet;
}

export function removeProperty(propertyName: string, pvs: PropertyValueSet): PropertyValueSet {
  return removeProperties([propertyName], pvs);
}

/// Gets an integer value, if the value is missing the onMissing function's
/// return value is returned.
export function getValue(propertyName: string, pvs: PropertyValueSet): PropertyValue.PropertyValue {
  const value = pvs[propertyName];
  return value;
}

/// Gets an amount value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
export function getAmount<T>(propertyName: string, pvs: PropertyValueSet): Amount.Amount<T> | undefined {
  if (!hasProperty(propertyName, pvs)) {
    return undefined;
  }
  return PropertyValue.getAmount(pvs[propertyName]);
}

/// Gets an integer value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
export function getText(propertyName: string, pvs: PropertyValueSet): string | undefined {
  if (!hasProperty(propertyName, pvs)) {
    return undefined;
  }
  return PropertyValue.getText(pvs[propertyName]);
}

/// Gets an integer value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
export function getInteger(propertyName: string, pvs: PropertyValueSet): number | undefined {
  if (!hasProperty(propertyName, pvs)) {
    return undefined;
  }
  return PropertyValue.getInteger(pvs[propertyName]);
}

export function filter(fn: (kvp: PropertyKeyValuePair) => boolean, pvs: PropertyValueSet): PropertyValueSet {
  const newSet: MutablePropertyValueSet = {};
  for (const name of Object.keys(pvs)) {
    if (fn({ key: name, value: pvs[name] })) {
      newSet[name] = pvs[name];
    }
  }
  return newSet;
}

export function map(fn: (kvp: PropertyKeyValuePair) => PropertyKeyValuePair, pvs: PropertyValueSet): PropertyValueSet {
  const newSet: MutablePropertyValueSet = {};
  for (const name of Object.keys(pvs)) {
    const map = fn({ key: name, value: pvs[name] });
    newSet[map.key] = map.value;
  }
  return newSet;
}

export function getValuesOfType(type: PropertyType, pvs: PropertyValueSet): PropertyValueSet {
  const newSet: MutablePropertyValueSet = {};
  for (const name of Object.keys(pvs)) {
    if (pvs[name].type === type) {
      newSet[name] = pvs[name];
    }
  }
  return newSet;
}

export function toString(pvs: PropertyValueSet): string {
  return Object.keys(pvs)
    .filter((p) => pvs[p] !== null && pvs[p] !== undefined)
    .map((p) => `${p}=${PropertyValue.toString(pvs[p])}`)
    .join(";");
}

export function toStringInSpecifiedOrder(order: Array<string>, pvs: PropertyValueSet): string {
  return order.map((p) => `${p}=${PropertyValue.toString(pvs[p])}`).join(";");
}

export function equals(
  other: PropertyValueSet,
  pvs: PropertyValueSet,
  comparer: PropertyValue.Comparer = PropertyValue.defaultComparer
): boolean {
  if (other === null || other === undefined) {
    return false;
  }
  if (pvs === other) {
    return true;
  }
  if (Object.keys(pvs).length !== Object.keys(other).length) {
    return false;
  }

  for (const name of Object.keys(pvs)) {
    if (!PropertyValue.equals(other[name], pvs[name], comparer)) {
      return false;
    }
  }
  return true;
}

/// RULES:
/// Format should be
/// Name1=Value1;Name2=Value2;Name3=Value3
/// Values that represents strings must be enclosed in double quote (") and if they contains double quote characters they must be encoded as %22.
function _stringToEntriesOrUndefinedIfInvalidString(
  encodedValueSet: string,
  unitLookup: UnitMap.UnitLookup
): PropertyValueSet | undefined {
  const entries: MutablePropertyValueSet = {};
  // Add extra semicolon on the end to close last name/value pair
  let toParse = encodedValueSet;
  if (!toParse.endsWith(";")) {
    toParse += ";";
  }
  //StringBuffer name = new StringBuffer();
  let name: string = "";
  //StringBuffer value = new StringBuffer();
  let value: string = "";
  let isInNamePart: boolean = true;
  let isInQuote: boolean = false;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i: number = 0; i < toParse.length; i++) {
    const c: string = toParse[i];
    switch (c) {
      case "=":
        if (!isInQuote) {
          if (!isInNamePart) {
            // Parse error
            return undefined;
          }
          isInNamePart = false;
        } else {
          value += c;
        }
        break;
      case ";":
        if (!isInQuote) {
          if (isInNamePart) {
            // Parse error
            return undefined;
          }
          let entryValue: PropertyValue.PropertyValue | undefined;
          // eslint-disable-next-line prefer-const
          entryValue = PropertyValue.fromString(value.toString(), unitLookup);
          //              if (!PropertyValue.TryParse(value.ToString(), out entryValue)) {
          if (entryValue === undefined) {
            // Parse error
            return undefined;
          }
          entries[name.toString()] = entryValue;
          isInNamePart = true;
          //name = new StringBuffer();
          //value = new StringBuffer();
          name = "";
          value = "";
        } else {
          value += c;
        }
        break;
      case '"':
        isInQuote = !isInQuote;
        value += c;
        break;
      default:
        if (isInNamePart) {
          name += c;
        } else {
          value += c;
        }
        break;
    }
  }
  return entries;
}

// function amend<PropertyValueSet, T2>(obj1: PropertyValueSet, obj2: T2): PropertyValueSet {
//   // return Object.assign({}, obj1, obj2);
//   return extend(extend({}, obj1), obj2);
//   return { ...obj1, ...obj2 }
// }

function amendProperty<T2 extends PropertyValue.PropertyValue>(
  pvs: PropertyValueSet,
  name: string,
  value: T2
): PropertyValueSet {
  // return amend(set, { [name]: value });
  return { ...pvs, [name]: value };
}

// function extend<TOrigin, TAdd>(origin: TOrigin, add: TAdd): TOrigin & TAdd {
//   var keys = Object.keys(add);
//   var i = keys.length;
//   while (i--) {
//     origin[keys[i]] = add[keys[i]];
//   }
//   return origin as TOrigin & TAdd;
// }

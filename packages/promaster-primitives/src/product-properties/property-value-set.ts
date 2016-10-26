import * as PropertyValue from "./property-value";
import * as Amount from "../measure/amount";
import {PropertyType} from "./property-value";
import {Quantity} from "../measure/quantity";

// Types

/// Represents a set of properties and a selected value for each of the properties.
export interface PropertyValueSet {
    readonly [key: string]: PropertyValue.PropertyValue;
}

// Functions

export function fromMap(map: Map<string, number | string | Amount.Amount<any>>): PropertyValueSet {
    let newSet = {};
    map.forEach((value, key)=> {
        newSet[key] = value;
    });
    return newSet;
}

export function fromObject(obj: any): PropertyValueSet {
    return obj as PropertyValueSet;
}


export function fromString(encodedValueSet: string): PropertyValueSet {
    const err = () => {
        throw new Error(`${encodedValueSet} is not a valid PropertyValueSet`);
    };
    return fromStringOrError(err, encodedValueSet);
}

export function fromStringOrError(onError: (encodedValueSet: string) => PropertyValueSet, encodedValueSet: string): PropertyValueSet {

    if (!encodedValueSet || encodedValueSet.length === 0) {
        return {};
    }
    var entries = _stringToEntriesOrUndefinedIfInvalidString(encodedValueSet);
    if (entries === undefined) {
        return onError(encodedValueSet);
    }
    else {
        return entries;
    }
}

export function fromProperty(propertyName: string, propertyValue: PropertyValue.PropertyValue) {
    return {
        [propertyName]: propertyValue
    }
}

export function isNullOrEmpty(propertyValueSet: PropertyValueSet | null): boolean {
    return propertyValueSet == null || propertyValueSet == {};
}

export function count(set: PropertyValueSet): number {
    return Object.keys(set).length;
}

export function get(propertyName: string, set: PropertyValueSet): PropertyValue.PropertyValue | undefined {
    if (!set.hasOwnProperty(propertyName))
        return undefined;
    return set[propertyName];
}

export function hasProperty(propertyName: string, set: PropertyValueSet): boolean {
    return set.hasOwnProperty(propertyName);
}

export function getPropertyNames(set: PropertyValueSet): Array<string> {
    return Object.keys(set);
}

export function merge(mergeWith: PropertyValueSet, set: PropertyValueSet): PropertyValueSet {
    return Object.assign({}, set, mergeWith);
}

export function set(propertyName: string, propertyValue: PropertyValue.PropertyValue, set: PropertyValueSet): PropertyValueSet {
    return Object.assign({}, set, {[propertyName]: propertyValue});
}

export function setAmount<T extends Quantity>(propertyName: string, amountValue: Amount.Amount<T>, set: PropertyValueSet): PropertyValueSet {
    return Object.assign({}, set, {[propertyName]: PropertyValue.fromAmount(amountValue)});
}

export function setInteger(propertyName: string, integerValue: number, set: PropertyValueSet): PropertyValueSet {
    return Object.assign({}, set, {[propertyName]: PropertyValue.fromInteger(integerValue)});
}

export function setText(propertyName: string, textValue: string, set: PropertyValueSet): PropertyValueSet {
    return Object.assign({}, set, {[propertyName]: PropertyValue.fromText(textValue)});
}

/// If a property exists with the same name in the PropertyValueSet as in the
// replacement set then the value of that property will be replaced.
export function setValues(replacementSet: PropertyValueSet, set: PropertyValueSet): PropertyValueSet {
    return Object.assign({}, set, replacementSet);

}

export function keepProperties(propertyNames: Array<string>, set: PropertyValueSet): PropertyValueSet {
    let newSet = {};
    for (let name of propertyNames) {
        newSet[name] = set[name];
    }
    return newSet;
}

export function removeProperties(propertyNames: Array<string>, set: PropertyValueSet): PropertyValueSet {
    let newSet = {};
    for (let name of Object.keys(set)) {
        if (propertyNames.indexOf(name) === -1)
            newSet[name] = set[name];
    }
    return newSet;
}

export function removeProperty(propertyName: string, set: PropertyValueSet): PropertyValueSet {
    return removeProperties([propertyName], set);
}

/// Gets an integer value, if the value is missing the onMissing function's
/// return value is returned.
export function getValue(propertyName: string,
                         set: PropertyValueSet): PropertyValue.PropertyValue {
    const value = set[propertyName];
    return value;
}

/// Gets an amount value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
export function getAmount<T extends Quantity>(propertyName: string, set: PropertyValueSet): Amount.Amount<T> | undefined {
    if (!hasProperty(propertyName, set))
        return undefined;
    return PropertyValue.getAmount(set[propertyName]);
}

/// Gets an integer value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
export function getText(propertyName: string, set: PropertyValueSet): string | undefined {
    if (!hasProperty(propertyName, set))
        return undefined;
    return PropertyValue.getText(set[propertyName]);
}

/// Gets an integer value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
export function getInteger(propertyName: string, set: PropertyValueSet): number | undefined {
    if (!hasProperty(propertyName, set))
        return undefined;
    return PropertyValue.getInteger(set[propertyName]);
}

export function addPrefixToValues(prefix: string, set: PropertyValueSet): PropertyValueSet {
    let newSet = {};
    for (let name of Object.keys(set)) {
        newSet[prefix + name] = set[name];
    }
    return newSet;
}

export function getValuesWithPrefix(prefix: string, removePrefix: boolean, set: PropertyValueSet): PropertyValueSet {
    let newSet = {};
    for (let name of Object.keys(set)) {
        if (name.startsWith(prefix)) {
            newSet[removePrefix ? name.substring(prefix.length) : name] = set[name];
        }
    }
    return newSet;
}

export function getValuesWithoutPrefix(prefix: string, removePrefix: boolean, set: PropertyValueSet): PropertyValueSet {
    let newSet = {};
    for (let name of Object.keys(set)) {
        if (!name.startsWith(prefix)) {
            newSet[removePrefix ? name.substring(prefix.length) : name] = set[name];
        }
    }
    return newSet;
}

export function getValuesOfType(type: PropertyType, set: PropertyValueSet): PropertyValueSet {
    let newSet = {};
    for (let name of Object.keys(set)) {
        if (set[name].type === type) {
            newSet[name] = set[name];
        }
    }
    return newSet;
}

// TODO: This should not exist as it is the same as keepProperties?
export function getProperties(propertiesToGet: Array<string>, set: PropertyValueSet): PropertyValueSet {
    return keepProperties(propertiesToGet, set);
}

export function toString(set: PropertyValueSet): string {
    return Object.keys(set).map((p) => `${p}=${PropertyValue.toString(set[p])}`).join(";");
}

export function toStringInSpecifiedOrder(order: Array<string>): string {
  return order.map((p) => `${p}=${PropertyValue.toString(set[p])}`).join(";");
}

export function equals(other: PropertyValueSet, set: PropertyValueSet) {
    if (other === null || other === undefined)
        return false;
    if (set === other)
        return true;
    if (Object.keys(set).length !== Object.keys(other).length)
        return false;

    for (let name of Object.keys(set)) {
        if (!PropertyValue.equals(other[name], set[name])) {
            return false;
        }
    }
    return true;
}

/// RULES:
/// Format should be
/// Name1=Value1;Name2=Value2;Name3=Value3
/// Values that represents strings must be enclosed in double quote (") and if they contains double quote characters they must be encoded as %22.
function _stringToEntriesOrUndefinedIfInvalidString(encodedValueSet: string): PropertyValueSet | undefined {

    var entries = {};
    // Add extra semicolon on the end to close last name/value pair
    var toParse = encodedValueSet;
    if (!toParse.endsWith(";"))
        toParse += ";";
    //StringBuffer name = new StringBuffer();
    let name: string = "";
    //StringBuffer value = new StringBuffer();
    let value: string = "";
    let isInNamePart: boolean = true;
    let isInQuote: boolean = false;
    for (let i: number = 0; i < toParse.length; i++) {
        let c: string = toParse[i];
        switch (c) {
            case '=':
                if (!isInQuote) {
                    if (!isInNamePart) {
                        // Parse error
                        return undefined;
                    }
                    isInNamePart = false;
                }
                else {
                    value = value + c;
                }
                break;
            case ';':
                if (!isInQuote) {
                    if (isInNamePart) {
                        // Parse error
                        return undefined;
                    }
                    let entryValue: PropertyValue.PropertyValue | undefined;
                    entryValue = PropertyValue.fromString(value.toString());
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
                }
                else {
                    value = value + c;
                }
                break;
            case '"':
                isInQuote = !isInQuote;
                value = value + c;
                break;
            default:
                if (isInNamePart) {
                    name = name + c;
                }
                else {
                    value = value + c;
                }
                break;
        }
    }
    return entries;

}



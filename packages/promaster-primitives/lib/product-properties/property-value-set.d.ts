/// <reference types="lodash" />
import * as PropertyValue from "./property-value";
import * as Amount from "../measure/amount";
import { PropertyType } from "./property-value";
import { Quantity } from "../measure/quantity";
export interface PropertyValueSet {
    readonly [key: string]: PropertyValue.PropertyValue;
}
export declare const Empty: PropertyValueSet;
export declare function fromMap(map: Map<string, number | string | Amount.Amount<any>>): PropertyValueSet;
export declare function fromObject(obj: any): PropertyValueSet;
export declare function fromString(encodedValueSet: string): PropertyValueSet;
export declare function fromStringOrError(onError: (encodedValueSet: string) => PropertyValueSet, encodedValueSet: string): PropertyValueSet;
export declare function fromProperty(propertyName: string, propertyValue: PropertyValue.PropertyValue): {
    [x: string]: PropertyValue.PropertyValue;
};
export declare function isNullOrEmpty(propertyValueSet: PropertyValueSet | null): boolean;
export declare function count(set: PropertyValueSet): number;
export declare function get(propertyName: string, set: PropertyValueSet): PropertyValue.PropertyValue | undefined;
export declare function hasProperty(propertyName: string, set: PropertyValueSet): boolean;
export declare function getPropertyNames(set: PropertyValueSet): Array<string>;
export declare function merge(mergeWith: PropertyValueSet, set: PropertyValueSet): PropertyValueSet;
export declare function set(propertyName: string, propertyValue: PropertyValue.PropertyValue, set: PropertyValueSet): PropertyValueSet;
export declare function setAmount<T extends Quantity>(propertyName: string, amountValue: Amount.Amount<T>, set: PropertyValueSet): PropertyValueSet;
export declare function setInteger(propertyName: string, integerValue: number, set: PropertyValueSet): PropertyValueSet;
export declare function setText(propertyName: string, textValue: string, set: PropertyValueSet): PropertyValueSet;
export declare function setValues(replacementSet: PropertyValueSet, set: PropertyValueSet): PropertyValueSet;
export declare function keepProperties(propertyNames: Array<string>, set: PropertyValueSet): PropertyValueSet;
export declare function removeProperties(propertyNames: Array<string>, set: PropertyValueSet): PropertyValueSet;
export declare function removeProperty(propertyName: string, set: PropertyValueSet): PropertyValueSet;
export declare function getValue(propertyName: string, set: PropertyValueSet): PropertyValue.PropertyValue;
export declare function getAmount<T extends Quantity>(propertyName: string, set: PropertyValueSet): Amount.Amount<T> | undefined;
export declare function getText(propertyName: string, set: PropertyValueSet): string | undefined;
export declare function getInteger(propertyName: string, set: PropertyValueSet): number | undefined;
export declare function addPrefixToValues(prefix: string, set: PropertyValueSet): PropertyValueSet;
export declare function getValuesWithPrefix(prefix: string, removePrefix: boolean, set: PropertyValueSet): PropertyValueSet;
export declare function getValuesWithoutPrefix(prefix: string, removePrefix: boolean, set: PropertyValueSet): PropertyValueSet;
export declare function getValuesOfType(type: PropertyType, set: PropertyValueSet): PropertyValueSet;
export declare function getProperties(propertiesToGet: Array<string>, set: PropertyValueSet): PropertyValueSet;
export declare function toString(set: PropertyValueSet): string;
export declare function toStringInSpecifiedOrder(order: Array<string>): string;
export declare function equals(other: PropertyValueSet, set: PropertyValueSet): boolean;

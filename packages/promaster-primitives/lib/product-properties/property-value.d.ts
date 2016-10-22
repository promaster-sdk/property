import * as Amount from '../measure/amount';
import { Unit } from '../measure/unit';
import { Quantity } from '../measure/quantity';
export declare type PropertyType = "amount" | "text" | "integer";
export interface AmountPropertyValue {
    readonly type: "amount";
    readonly value: Amount.Amount<any>;
}
export interface TextPropertyValue {
    readonly type: "text";
    readonly value: string;
}
export interface IntegerPropertyValue {
    readonly type: "integer";
    readonly value: number;
}
export declare type PropertyValue = AmountPropertyValue | TextPropertyValue | IntegerPropertyValue;
export declare function create(type: PropertyType, value: Amount.Amount<any> | string | number): PropertyValue;
export declare function fromString(encodedValue: string): PropertyValue | undefined;
export declare function fromAmount<T extends Quantity>(amountValue: Amount.Amount<T>): PropertyValue;
export declare function fromText(textValue: string): PropertyValue;
export declare function fromInteger(integerValue: number): PropertyValue;
export declare function getInteger(value: PropertyValue): number | undefined;
export declare function getAmount<T extends Quantity>(value: PropertyValue): Amount.Amount<T> | undefined;
export declare function getText(value: PropertyValue): string | undefined;
export declare function valueAs<T extends Quantity>(unit: Unit<T>, value: PropertyValue): number | undefined;
export declare function toString(value: PropertyValue): string;
export declare function compareTo(left: PropertyValue, right: PropertyValue): number;
export declare function equals(other: PropertyValue, value: PropertyValue): boolean;
export declare function lessThan(left: PropertyValue, right: PropertyValue): boolean;
export declare function lessOrEqualTo(left: PropertyValue, right: PropertyValue): boolean;
export declare function greaterThan(left: PropertyValue, right: PropertyValue): boolean;
export declare function greaterOrEqualTo(left: PropertyValue, right: PropertyValue): boolean;

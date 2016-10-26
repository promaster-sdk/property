import { Quantity, Dimensionless } from "./quantity";
export interface Unit<T extends Quantity> {
    readonly quantity: Quantity;
    readonly innerUnit: InnerUnit<T>;
}
export declare type InnerUnit<T extends Quantity> = AlternateUnit<T> | BaseUnit<T> | ProductUnit<T> | TransformedUnit<T>;
export interface BaseUnit<T extends Quantity> {
    readonly type: "base";
    readonly symbol: string;
}
export interface AlternateUnit<T extends Quantity> {
    readonly type: "alternate";
    readonly symbol: string;
    readonly parent: Unit<any>;
}
export interface TransformedUnit<T extends Quantity> {
    readonly type: "transformed";
    readonly parentUnit: Unit<T>;
    readonly toParentUnitConverter: UnitConverter;
}
export interface ProductUnit<T extends Quantity> {
    readonly type: "product";
    readonly elements: Array<Element>;
}
export interface Element {
    readonly unit: Unit<any>;
    readonly pow: number;
}
export declare type UnitConverter = OffsetConverter | CompoundConverter | FactorConverter | IdentityConverter;
export interface CompoundConverter {
    readonly type: "compound";
    readonly first: UnitConverter;
    readonly second: UnitConverter;
}
export interface FactorConverter {
    readonly type: "factor";
    readonly factor: number;
}
export interface IdentityConverter {
    readonly type: "identity";
}
export interface OffsetConverter {
    readonly type: "offset";
    readonly offset: number;
}
export declare const One: Unit<Dimensionless>;
export declare function createBase<T extends Quantity>(quantity: T, symbol: string): Unit<T>;
export declare function createAlternate<T extends Quantity>(symbol: string, parent: Unit<any>): Unit<T>;
export declare function times<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T>;
export declare function divide<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T>;
export declare function timesNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T>;
export declare function divideNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T>;
export declare function plus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T>;
export declare function minus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T>;
export declare function convert(value: number, fromUnit: Unit<Quantity>, toUnit: Unit<Quantity>): number;

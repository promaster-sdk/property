import * as Unit from './unit';
import { Dimensionless, Quantity } from "./quantity";
export interface Amount<T extends Quantity> {
    value: number;
    unit: Unit.Unit<T>;
    decimalCount: number;
}
export declare function create<T extends Quantity>(value: number, unit: Unit.Unit<T>, decimalCount?: number | undefined): Amount<T>;
export declare function toString<T extends Quantity>(amount: Amount<T>): string;
export declare function neg<T extends Quantity>(amount: Amount<T>): Amount<T>;
export declare function isQuantity<T extends Quantity>(quantityType: T, amount: Amount<T>): boolean;
export declare function plus<T extends Quantity>(left: Amount<T>, right: Amount<T>): Amount<T>;
export declare function minus<T extends Quantity>(left: Amount<T>, right: Amount<T>): Amount<T>;
export declare function times<T extends Quantity>(left: Amount<T>, right: number | Amount<Dimensionless>): Amount<T>;
export declare function divide<T extends Quantity>(left: Amount<T>, right: number | Amount<Dimensionless>): Amount<T>;
export declare const equals: <T extends Quantity>(left: Amount<T>, right: Amount<T>) => boolean;
export declare const lessThan: <T extends Quantity>(left: Amount<T>, right: Amount<T>) => boolean;
export declare const greaterThan: <T extends Quantity>(left: Amount<T>, right: Amount<T>) => boolean;
export declare const lessOrEqualTo: <T extends Quantity>(left: Amount<T>, right: Amount<T>) => boolean;
export declare const greaterOrEqualTo: <T extends Quantity>(left: Amount<T>, right: Amount<T>) => boolean;
export declare function clamp<T extends Quantity>(minAmount: Amount<T>, maxAmount: Amount<T>, amount: Amount<T>): Amount<T>;
export declare function max<T extends Quantity>(a2: Amount<T>, amount: Amount<T>): Amount<T>;
export declare function min<T extends Quantity>(a2: Amount<T>, amount: Amount<T>): Amount<T>;
export declare function roundDown<T extends Quantity>(step: Amount<T>, amount: Amount<T>): Amount<T>;
export declare function roundUp<T extends Quantity>(step: Amount<T>, amount: Amount<T>): Amount<T>;
export declare function compareTo<T extends Quantity>(other: Amount<T>, amount: Amount<T>): number;
export declare function abs<T extends Quantity>(amount: Amount<T>): Amount<T>;
export declare function valueAs<T extends Quantity>(toUnit: Unit.Unit<T>, amount: Amount<T>): number;

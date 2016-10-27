import * as Unit from './unit';
import { Dimensionless, Quantity } from "./quantity";
export interface Amount<T extends Quantity> {
    value: number;
    unit: Unit.Unit<T>;
    decimalCount: number;
}
/**
 * Creates an amount that represents the an exact/absolute value in the specified
 * unit. For example if you create an exact amount of 2 degrees Fahrenheit that
 * will represent -16.6666667 degrees Celsius.
 */
export declare function create<T extends Quantity>(value: number, unit: Unit.Unit<T>, decimalCount?: number | undefined): Amount<T>;
export declare function toString<T extends Quantity>(amount: Amount<T>): string;
/** Simulate negation unary operator. */
export declare function neg<T extends Quantity>(amount: Amount<T>): Amount<T>;
export declare function isQuantity<T extends Quantity>(quantity: T, amount: Amount<T>): boolean;
/**
 * Adds two amounts together.
 * The two amounts amounts must have the same quantity.
 * The resulting amount will be of the same quantity as the two amounts.
 * @param left The left-hand amount.
 * @param right The right-hand
 * @returns left + right
 */
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
/**
 * Gets the absolute amount (equivalent of Math.Abs())
 * @param amount The amount to get the aboslute amount from.
 */
export declare function abs<T extends Quantity>(amount: Amount<T>): Amount<T>;
/**
 * Gets the value of the amount as a number in the specified unit
 * @param toUnit The unit to get the amount in.
 * @param amount The amount to get the value from.
 */
export declare function valueAs<T extends Quantity>(toUnit: Unit.Unit<T>, amount: Amount<T>): number;

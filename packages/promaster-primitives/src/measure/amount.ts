import * as Unit from './unit';
import * as UnitName from './unit-name';
import {Dimensionless, Quantity} from "./quantity";
import * as Units from "./units";
import * as CompareUtils from "../utils/compare_utils";

export interface Amount<T extends Quantity> {
  value: number;
  unit: Unit.Unit<T>;
  decimalCount: number;
}

/**
 * Creates an amount that represents the an exact/absolute value in the specified
 * unit. For example if you create an exact amount of 2 degrees Fahrenheit that
 * will represent -16.6666667 degrees Celsius.
 * @param value {number} The numeric value of the amount.
 * @param unit {Unit<T>} The unit of the amount.
 * @param decimalCount {number | undefined} The decimalCount of the amount.
 * @returns {Amount<T>} The created amount.
 */
export function create<T extends Quantity>(value: number, unit: Unit.Unit<T>, decimalCount: number | undefined = undefined): Amount<T> {
  return _factory<T>(value, unit, decimalCount);
}

export function toString<T extends Quantity>(amount: Amount<T>): string {
  const unitname = UnitName.getName(amount.unit);
  if (unitname.length > 0)
    return amount.value.toString() + " " + unitname;
  return amount.value.toString();
}

/** Simulate negation unary operator. */
export function neg<T extends Quantity>(amount: Amount<T>): Amount<T> {
  return create<T>(-amount.value, amount.unit);
}

export function isQuantity<T extends Quantity>(quantity: T, amount: Amount<T>): boolean {
  // Amount does not store the quanitty but Unit does
  // return Unit.getQuantityType(amount.unit) === quantityType;
  return amount.unit.quantity === quantity;
}

/**
 * Adds two amounts together.
 * The two amounts amounts must have the same quantity.
 * The resulting amount will be of the same quantity as the two amounts.
 * @param left The left-hand amount.
 * @param right The right-hand
 * @returns left + right
 */
export function plus<T extends Quantity>(left: Amount<T>, right: Amount<T>): Amount<T> {
  return _factory<T>(left.value + valueAs<T>(left.unit, right), left.unit);
}

export function minus<T extends Quantity>(left: Amount<T>, right: Amount<T>): Amount<T> {
  return _factory<T>(left.value - valueAs<T>(left.unit, right), left.unit);
}

export function times<T extends Quantity>(left: Amount<T>, right: number | Amount<Dimensionless>): Amount<T> {
  if (typeof right === "number")
    return _factory<T>(left.value * right, left.unit);
  else if (right.unit.quantity === "Dimensionless")
    return _factory<T>(left.value * valueAs<T>(Units.One, right), left.unit);
  else
    throw new Error(`Cannot perform '*' operation with value of type '${right}'.`);
}

export function divide<T extends Quantity>(left: Amount<T>, right: number | Amount<Dimensionless>): Amount<T> {
  if (typeof right === "number")
    return _factory<T>(left.value / right, left.unit);
  else if (right.unit.quantity === "Dimensionless")
    return _factory<T>(left.value / valueAs<T>(Units.One, right), left.unit);
  else
    throw new Error(`Cannot perform '*' operation with value of type '${right}'.`);
}

/// Comparsion operators

export const equals = <T extends Quantity>(left: Amount<T>, right: Amount<T>): boolean => _comparison(left, right, true) == 0;

export const lessThan = <T extends Quantity>(left: Amount<T>, right: Amount<T>): boolean => _comparison(left, right, false) < 0;

export const greaterThan = <T extends Quantity>(left: Amount<T>, right: Amount<T>): boolean => _comparison(left, right, false) > 0;

export const lessOrEqualTo = <T extends Quantity>(left: Amount<T>, right: Amount<T>): boolean => _comparison(left, right, false) <= 0;

export const greaterOrEqualTo = <T extends Quantity>(left: Amount<T>, right: Amount<T>): boolean => _comparison(left, right, false) >= 0;

export function clamp<T extends Quantity>(minAmount: Amount<T>, maxAmount: Amount<T>, amount: Amount<T>): Amount<T> {
  return min(maxAmount, max(minAmount, amount));
}

export function max<T extends Quantity>(a2: Amount<T>, amount: Amount<T>): Amount<T> {
  if (a2 == null)
    return amount;
  return amount > a2 ? amount : a2;
}

export function min<T extends Quantity>(a2: Amount<T>, amount: Amount<T>): Amount<T> {
  if (a2 == null)
    return amount;
  return amount < a2 ? amount : a2;
}

export function roundDown<T extends Quantity>(step: Amount<T>, amount: Amount<T>): Amount<T> {
  const div = amount.value / step.value;
  return _factory<T>(Math.floor(div) * step.value, amount.unit);
}

export function roundUp<T extends Quantity>(step: Amount<T>, amount: Amount<T>): Amount<T> {
  const div = amount.value / step.value;
  return _factory<T>(Math.ceil(div) * step.value, amount.unit);
}

export function compareTo<T extends Quantity>(other: Amount<T>, amount: Amount<T>): number {
  return _comparison(amount, other, true);
}

/**
 * Gets the absolute amount (equivalent of Math.Abs())
 * @param amount The amount to get the aboslute amount from.
 */
export function abs<T extends Quantity>(amount: Amount<T>): Amount<T> {
  return _factory<T>(Math.abs(amount.value), amount.unit);
}

/**
 * Gets the value of the amount as a number in the specified unit
 * @param toUnit The unit to get the amount in.
 * @param amount The amount to get the value from.
 */
export function valueAs<T extends Quantity>(toUnit: Unit.Unit<T>, amount: Amount<T>): number {
  return Unit.convert(amount.value, amount.unit, toUnit);
}

///////////////////////////////
/// BEGIN PRIVATE DECLARATIONS
///////////////////////////////

function _factory<T extends Quantity>(value: number, unit: Unit.Unit<T>, decimalCount: number | undefined = undefined): Amount<T> {

  if(typeof value !== "number")
    throw new Error("value must be a number.");

  if(typeof unit !== "object")
    throw new Error("unit must be an object.");

  if(decimalCount !== undefined && typeof decimalCount !== "number")
    throw new Error("decimalCount must be an undefined or a number.");

  if (decimalCount === undefined) {
    decimalCount = 0;
    const stringValue = value.toString();
    const pointIndex = stringValue.indexOf('.');
    if (pointIndex >= 0)
      decimalCount = stringValue.length - pointIndex - 1;
  }
  return {
    value: value,
    unit: unit,
    decimalCount: decimalCount
  };
}

function _comparison<T1 extends Quantity, T2 extends Quantity>(a1: Amount<T1>, a2: Amount<T2>, allowNullOrUndefined: boolean): number {
  if (!allowNullOrUndefined) {
    // We don't allow nulls for < and > because it would cause strange behavior, e.g. 1 < null would work which it shouldn't
    if (a1 === null || a1 === undefined) throw new Error("ArgumentNull: a1");
    if (a2 === null || a2 === undefined) throw new Error("ArgumentNull: a2");
  }
  else {
    // Handle nulls
    if ((a1 === null && a2 === null) || (a1 === undefined && a2 === undefined))
      return 0;
    if (a1 === null || a1 === undefined)
      return 1;
    if (a2 === null || a2 === undefined)
      return 2;
  }

  // Convert the second amount to the same unit as the first and compare the values
  const a1Value = a1.value;
  const a2Value = valueAs<T2>(a1.unit, a2);

  return CompareUtils.compareNumbers(a1Value, a2Value, Math.max(a1.decimalCount, a2.decimalCount));
}

import { Quantity, Dimensionless } from "./quantity";
/**
 * This record represents a determinate quantity (as of length, time, heat, or value)
 * adopted as a standard of measurement.
 *
 * It is helpful to think of instances of this record as recording the history by which
 * they are created. Thus, for example, the string "g/kg" (which is a dimensionless unit)
 * would result from invoking the method toString() on a unit that was created by
 * dividing a gram unit by a kilogram unit. Yet, "kg" divided by "kg" returns ONE and
 * not "kg/kg" due to automatic unit factorization.
 *
 * This record supports the multiplication of offsets units. The result is usually a unit
 * not convertible to its standard unit. Such units may appear in derivative quantities.
 * For example °C/m is an unit of gradient, which is common in atmospheric and oceanographic research.
 *
 * Units raised at rational powers are also supported. For example the cubic root of liter
 * is a unit compatible with meter.
 */
export interface Unit<T extends Quantity> {
    readonly quantity: Quantity;
    readonly innerUnit: InnerUnit<T>;
}
export declare type InnerUnit<T extends Quantity> = AlternateUnit<T> | BaseUnit<T> | ProductUnit<T> | TransformedUnit<T>;
/**
 * This record represents the building blocks on top of which all others
 * units are created.
 * This record represents the "standard base units" which includes SI base
 * units and possibly others user-defined base units. It does not represent
 * the base units of any specific System Of Units (they would have
 * be base units accross all possible systems otherwise).
 */
export interface BaseUnit<T extends Quantity> {
    readonly type: "base";
    /** Holds the unique symbol for this base unit. */
    readonly symbol: string;
}
/**
 * This record represents the units used in expressions to distinguish
 * between quantities of a different nature but of the same dimensions.
 */
export interface AlternateUnit<T extends Quantity> {
    readonly type: "alternate";
    readonly symbol: string;
    /** Holds the parent unit (a system unit). */
    readonly parent: Unit<any>;
}
/**
 * This record represents the units derived from other units using
 * UnitConverter converters.
 *
 * Examples of transformed units:
 *       CELSIUS = KELVIN.add(273.15);
 *       FOOT = METER.multiply(0.3048);
 *       MILLISECOND = MILLI(SECOND);
 *
 * Transformed units have no label. But like any other units,
 *  they may have labels attached to them:
 *       UnitFormat.getStandardInstance().label(FOOT, "ft");
 *
 *   or aliases:
 *       UnitFormat.getStandardInstance().alias(CENTI(METER)), "centimeter");
 *       UnitFormat.getStandardInstance().alias(CENTI(METER)), "centimetre");
 */
export interface TransformedUnit<T extends Quantity> {
    readonly type: "transformed";
    /** Holds the parent unit (not a transformed unit). */
    readonly parentUnit: Unit<T>;
    /** Holds the converter to the parent unit. */
    readonly toParentUnitConverter: UnitConverter;
}
/**
 * This record represents units formed by the product of rational powers of
 * existing units.
 * This record maintains the canonical form of this product (simplest
 * form after factorization). For example:
 * METER.pow(2).divide(METER) returns METER.
 */
export interface ProductUnit<T extends Quantity> {
    readonly type: "product";
    readonly elements: Array<Element>;
}
/** Represents a rational power of a single unit. */
export interface Element {
    /** Holds the single unit. */
    readonly unit: Unit<any>;
    /** Holds the power exponent. */
    readonly pow: number;
}
/**
 * This type represents a converter of numeric values.
 * Sub-types must ensure unicity of the identity
 * converter. In other words, if the result of an operation is equivalent
 * to the identity converter, then the unique IDENTITY instance
 * should be returned.
 */
export declare type UnitConverter = OffsetConverter | CompoundConverter | FactorConverter | IdentityConverter;
/** This record represents a compound converter. */
export interface CompoundConverter {
    readonly type: "compound";
    /** Holds the first converter. */
    readonly first: UnitConverter;
    /** Holds the second converter. */
    readonly second: UnitConverter;
}
export interface FactorConverter {
    readonly type: "factor";
    readonly factor: number;
}
/** This record represents the identity converter (singleton). */
export interface IdentityConverter {
    readonly type: "identity";
}
export interface OffsetConverter {
    readonly type: "offset";
    readonly offset: number;
}
/** Holds the dimensionless unit ONE */
export declare const One: Unit<Dimensionless>;
/**
 * Creates a base unit having the specified symbol.
 * @param quantity The quantity of the resulting unit.
 * @param symbol The symbol of this base unit.
 */
export declare function createBase<T extends Quantity>(quantity: T, symbol: string): Unit<T>;
/**
 * Creates an alternate unit for the specified unit identified by the
 * specified symbol.
 * @param symbol The symbol for this alternate unit.
 * @param parent Parent the system unit from which this alternate unit is derived.
 */
export declare function createAlternate<T extends Quantity>(symbol: string, parent: Unit<any>): Unit<T>;
/**
 * Returns the product of the specified units.
 * @param quantity The quantity of the resulting unit.
 * @param left The left unit operand.
 * @param right The right unit operand.</param>
 * @returns left * right
 */
export declare function times<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T>;
/**
 * Returns the quotient of the specified units.
 * @param quantity The quantity of the resulting unit.
 * @param left The dividend unit operand.
 * @param right The divisor unit operand.
 * @returns left / right
 */
export declare function divide<T extends Quantity>(quantity: T, left: Unit<Quantity>, right: Unit<Quantity>): Unit<T>;
export declare function timesNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T>;
export declare function divideNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T>;
export declare function plus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T>;
export declare function minus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T>;
/**
 * Converts numeric values from a unit to another unit.
 * @param value The numeric value to convert.
 * @param fromUnit The unit from which to convert the numeric value.
 * @param toUnit The unit to which to convert the numeric value.
 * @returns The converted numeric value.
 */
export declare function convert(value: number, fromUnit: Unit<Quantity>, toUnit: Unit<Quantity>): number;

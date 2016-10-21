import {Quantity} from "./quantity";
import * as UnitConverter from "./unit_converters/unit_converter";
import {Element, create as createElement} from "./units/element";
import * as TransformedUnit from "./units/transformed_unit";
import * as ProductUnit from "./units/product_unit";
import * as AlternateUnit from "./units/alternate_unit";
import * as BaseUnit from "./units/base_unit";

export interface Unit<T extends Quantity> {
	readonly quantity: Quantity,
	readonly elements: Array<Element>,
	readonly innerUnit: InnerUnit<T>,
}

export type InnerUnit<T extends Quantity> =
	AlternateUnit.AlternateUnit<T>
		| BaseUnit.BaseUnit<T>
		| ProductUnit.ProductUnit<T>
		| TransformedUnit.TransformedUnit<T>;


/// This class represents a determinate quantity (as of length, time, heat, or value)
/// adopted as a standard of measurement.
///
/// It is helpful to think of instances of this class as recording the history by which
/// they are created. Thus, for example, the string "g/kg" (which is a dimensionless unit)
/// would result from invoking the method toString() on a unit that was created by
/// dividing a gram unit by a kilogram unit. Yet, "kg" divided by "kg" returns ONE and
/// not "kg/kg" due to automatic unit factorization.
///
/// This class supports the multiplication of offsets units. The result is usually a unit
/// not convertible to its standard unit. Such units may appear in derivative quantities.
/// For example °C/m is an unit of gradient, which is common in atmospheric and oceanographic research.
///
/// Units raised at rational powers are also supported. For example the cubic root of liter
/// is a unit compatible with meter.
///
/// Instances of this class and sub-classes are immutable.

/// Holds the dimensionless unit ONE
//public static readonly Unit<T> One = new ProductUnit<T>();

/// We keep a global repository of Labels becasue if a Unit object is derived from arithmetic operations
/// it may still be considered equal to an existing unit and thus should have the same label.
const _typeLabels: Map<Unit<any>, string> = new Map();


export function create<T extends Quantity>(quantity: T, elements: Array<Element>, innerUnit: InnerUnit<T>): Unit<T> {
	return {
		quantity,
		// // Init elements to standard, some other constructors can override this by re-setting _elements
		// elements: [createElement(this, 1)],
		elements,
		innerUnit
	}
}

export function getLabel<T extends Quantity>(unit: Unit<T>): string {
	const label = _typeLabels.get(unit);
	if (label === undefined)
		return "";
	return label;
}

/// Creates a ProductUnit.
export function times<T extends Quantity>(quantity: T, u: Unit<any>): Unit<T> {
	return ProductUnit.Product(quantity, this, u);
}

/// Creates a ProductUnit.
export function divide<T extends Quantity>(quantity: T, u: Unit<any>): Unit<T> {
	return ProductUnit.Quotient(quantity, this, u);
}

/// Returns the BaseUnit, AlternateUnit or product of base units
/// and alternate units this unit is derived
/// from. The standard unit identifies the "type" of
/// Quantity for which this unit is employed.
// TYPESCRIPT DOES NOT SUPPORT abstract getters
// TODO: Make this an abstract method instead of a getter...
export function getStandardUnit<T extends Quantity>(unit: Unit<T>): Unit<any> {
	throw new Error("This is abstract (which is not supported by TS).");
}

// /// Returns the converter from this unit to its system unit.
// abstract toStandardUnit():UnitConverter;
export function toStandardUnit<T extends Quantity>(unit: Unit<T>): UnitConverter.UnitConverter {
	switch(unit.innerUnit.type) {
		case "alternate":
			return AlternateUnit.toStandardUnit(unit.innerUnit);
		case "base":
			return BaseUnit.toStandardUnit();
		case "product":
			return ProductUnit.toStandardUnit(unit);
		case "transformed":
			return TransformedUnit.toStandardUnit(unit.innerUnit);
	}
	throw new Error(`Unknown innerUnit ${JSON.stringify(unit)}`);
}

/// Indicates if this unit is a standard unit (base units and
/// alternate units are standard units). The standard unit identifies
/// the "type" of {@link javax.measure.quantity.Quantity quantity} for
/// which the unit is employed.
/// <returns><code>getStandardUnit().equals(this)</code></returns>
export function isStandardUnit<T extends Quantity>(unit: Unit<T>): boolean {
	return getStandardUnit(unit) === unit;
}

/// Returns a converter of numeric values from this unit to another unit.
/// <param name="that">the unit to which to convert the numeric values.</param>
/// <returns>the converter from this unit to <code>that</code> unit.</returns>
export function getConverterTo<T extends Quantity>(that: Unit<any>, unit: Unit<T>): UnitConverter.UnitConverter {
	if (this == that) {
		return UnitConverter.Identity;
	}
	return UnitConverter.concatenate(toStandardUnit(unit), UnitConverter.inverse(toStandardUnit(that)));
}

/// ProductUnit overrides this because it has multiple elements
export function getElements<T extends Quantity>(unit: Unit<T>): Array<Element> {
	return unit.elements;
}

export function toString<T extends Quantity>(unit: Unit<T>): string {
	return getName(unit);
}

export function getQuantityType<T extends Quantity>(unit: Unit<T>): Quantity {
	return unit.quantity;
}

export function getName<T extends Quantity>(unit: Unit<T>): string {
	const label = getLabel(unit);
	if (label === undefined)
		return buildDerivedName(unit);
	return label;
}

export function buildDerivedName<T extends Quantity>(unit: Unit<T>): string {
	return ""
}

export function withLabel<T extends Quantity>(label: string, unit: Unit<T>): Unit<T> {
	_typeLabels.set(unit, label);
	return unit;
}

/// Returns the unit derived from this unit using the specified converter.
/// The converter does not need to be linear.
/// <param name="operation">the converter from the transformed unit to this unit.</param>
/// <returns>the unit after the specified transformation.</returns>
export function transform<T extends Quantity>(operation: UnitConverter.UnitConverter, unit: Unit<T>): Unit<T> {
	//if (identical(operation, UnitConverter.Identity)) {
	//  return this;
	//}
	if (operation === UnitConverter.Identity) {
		return this;
	}
	return TransformedUnit.create(unit, operation);
}

// Simulate operator overload
export function timesNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T> {
	return transform(UnitConverter.factor(factor), unit);
}

// Simulate operator overload
export function divideNumber<T extends Quantity>(factor: number, unit: Unit<T>): Unit<T> {
	return transform(UnitConverter.factor(1.0 / factor), unit);
}

// Simulate operator overload
export function plus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T> {
	return transform(UnitConverter.offset(offset), unit);
}

// Simulate operator overload
export function minus<T extends Quantity>(offset: number, unit: Unit<T>): Unit<T> {
	return transform(UnitConverter.offset(-offset), unit);
}


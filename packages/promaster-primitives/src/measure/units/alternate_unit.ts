import {Quantity} from "../quantity";
import {UnitConverter} from "../unit_converters/unit_converter";
import * as Unit from "../unit";

export interface AlternateUnit<T extends Quantity> {
	readonly type: "alternate",
	/// Holds the symbol.
	readonly symbol: string,
	/// Holds the parent unit (a system unit).
	readonly parent: Unit.Unit<any>,
}


/// This class represents the units used in expressions to distinguish
/// between quantities of a different nature but of the same dimensions.
///
/// Instances of this class are created through the
/// {@link Unit#alternate(String)} method.

/// Creates an alternate unit for the specified unit identified by the
/// specified symbol.
/// <param name="symbol">the symbol for this alternate unit.</param>
/// <param name="parent">parent the system unit from which this alternate unit is derived.</param>
export function create<T extends Quantity>(symbol: string, parent: Unit.Unit<any>): Unit.Unit<T> {
	return Unit.create(parent.quantity, [], {type: "alternate", symbol, parent} as AlternateUnit<T>);
	// return {
	// 	quantity: parent.quantity,
	// 	// Init elements to standard, some other constructors can override this by re-setting _elements
	// 	// elements: [new Element(this, 1)],
	// 	elements: [],
	// 	symbol: symbol,
	// 	parent: parent,
	// }
}

/// Implements abstract method.
export function getStandardUnit<T extends Quantity>(unit: Unit.Unit<T>): Unit.Unit<any> {
	return unit;
}

/// Implements abstract method.
export function toStandardUnit<T extends Quantity>(unit: AlternateUnit<T>): UnitConverter {
	return Unit.toStandardUnit(unit.parent);
}

export function buildDerivedName<T extends Quantity>(unit: AlternateUnit<T>): string {
	return unit.symbol;
}


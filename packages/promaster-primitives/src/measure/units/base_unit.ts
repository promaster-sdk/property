import {Quantity} from "../quantity";
import * as UnitConverter from "../unit_converters/unit_converter";
import * as Unit from "../unit";

export interface BaseUnit<T extends Quantity> {
	readonly type: "base",
	/// Holds the unique symbol for this base unit.
	readonly symbol: string,
}

/// This class represents the building blocks on top of which all others
/// units are created.
/// This class represents the "standard base units" which includes SI base
/// units and possibly others user-defined base units. It does not represent
/// the base units of any specific System Of Units (they would have
/// be base units accross all possible systems otherwise).

/// Creates a base unit having the specified symbol.
/// <param name="symbol">the symbol of this base unit.</param>
export function create<T extends Quantity>(quantity: T, symbol: string): Unit.Unit<T> {
	return Unit.create(quantity, [], {type: "base", symbol} as BaseUnit<T>);
	// return {
	// 	quantity,
	// 	// // Init elements to standard, some other constructors can override this by re-setting _elements
	// 	// elements: [new Element(this, 1)],
	// 	elements: [],
	// 	symbol: symbol,
	// }
}

/// Indicates if this base unit is considered equals to the specified
/// object (both are base units with equal symbol, standard dimension and
/// standard transform).
/// <param name="that">the object to compare for equality.</param>
/// <returns>true if this and that are considered equals; false otherwise.</returns>
//@override bool operator ==(other) => other is BaseUnit<T> && other._symbol == _symbol;

/// Implements abstract method.
//@override int get hashCode => _symbol.hashCode;

export function buildDerivedName<T extends Quantity>(unit: BaseUnit<T>): string {
	return unit.symbol;
}

/// Implements abstract method.
export function toStandardUnit<T extends Quantity>(): UnitConverter.UnitConverter {
	return UnitConverter.Identity;
}

/// Implements abstract method.
export function getStandardUnit<T extends Quantity>(unit: Unit.Unit<T>): Unit.Unit<any> {
	return unit;
}


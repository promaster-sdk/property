import {Unit} from "../unit";

export interface Element {
	/// Holds the single unit.
	readonly unit: Unit<any>;
	/// Holds the power exponent.
	readonly pow: number;
}


/// Inner product element represents a rational power of a single unit.

/// Structural constructor.
/// <param name="unit">the unit.</param>
/// <param name="pow">the power exponent.</param>
export function create(unit: Unit<any>, pow: number): Element {
	//if(this._unit instanceof ProductUnit)
	//  throw "Cannot have a product unit in an element.";
	return {unit, pow};
}

export function toString(element: Element): string {
	return `Element: ${element.unit.toString()}, ${element.pow}`;
}

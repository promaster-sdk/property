import * as UnitConverter from "../unit_converter";

export interface Compound {
	readonly type: "compound",
	/// Holds the first converter.
	readonly first: UnitConverter.UnitConverter,
	/// Holds the second converter.
	readonly second: UnitConverter.UnitConverter,
}

/// This inner class represents a compound converter.

/// Creates a compound converter resulting from the combined
/// transformation of the specified converters.
/// <param name="first">the first converter.</param>
/// <param name="second">second the second converter.</param>
export function create(first: UnitConverter.UnitConverter, second: UnitConverter.UnitConverter): Compound {
	return {
		type: "compound",
		first,
		second,
	}
}

/// Implements abstract method.
export function convert(value: number, converter: Compound): number {
	return UnitConverter.convert(UnitConverter.convert(value, converter.first), converter.second);
}

/// Implements abstract method.
export function inverse(converter: Compound): UnitConverter.UnitConverter {
	return create(UnitConverter.inverse(converter.second), UnitConverter.inverse(converter.first));
}


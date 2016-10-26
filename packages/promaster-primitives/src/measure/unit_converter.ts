import * as OffsetConverter from "./unit_converters/offset_converter";
import * as Compound from "./unit_converters/compound_converter";
import * as FactorConverter from "./unit_converters/factor_converter";
import * as IdentityConverter from "./unit_converters/identity_converter";

export type UnitConverter = OffsetConverter.OffsetConverter | Compound.Compound | FactorConverter.FactorConverter | IdentityConverter.IdentityConverter;

/// This class represents a converter of numeric values.
///
/// It is not required for sub-classes to be immutable
/// (e.g. currency converter).
///
/// Sub-classes must ensure unicity of the identity
/// converter. In other words, if the result of an operation is equivalent
/// to the identity converter, then the unique IDENTITY instance
/// should be returned.

/// Holds the identity converter (unique). This converter does nothing
/// (ONE.convert(x) == x).
export const Identity: UnitConverter = IdentityConverter.create();

/// Returns the inverse of this converter. If x is a valid
/// value, then x == inverse().convert(convert(x)) to within
/// the accuracy of computer arithmetic.
export function inverse(converter: UnitConverter): UnitConverter {
	switch (converter.type) {
		case "compound":
			return Compound.inverse(converter);
		case "factor":
			return FactorConverter.inverse(converter);
		case "identity":
			return IdentityConverter.inverse(converter);
		case "offset":
			return OffsetConverter.inverse(converter);
	}
	throw new Error("Unknown unit converter");
}

/// Converts a double value.
/// <param name="x">the numeric value to convert.</param>
/// <returns>the converted numeric value.</returns>
export function convert(value: number, converter: UnitConverter): number {
	switch (converter.type) {
		case "compound":
			return Compound.convert(value, converter);
		case "factor":
			return FactorConverter.convert(value, converter);
		case "identity":
			return IdentityConverter.convert(value);
		case "offset":
			return OffsetConverter.convert(value, converter);
	}
	throw new Error("Unknown unit converter");
}

/// Concatenates this converter with another converter. The resulting
/// converter is equivalent to first converting by the specified converter,
/// and then converting by this converter.
///
/// Note: Implementations must ensure that the IDENTITY instance
///       is returned if the resulting converter is an identity
///       converter.
/// <param name="converter">the other converter.</param>
/// <returns>the concatenation of this converter with the other converter.</returns>
export function concatenate(concatConverter: UnitConverter, converter: UnitConverter): UnitConverter {
	//return identical(converter, Identity) ? this : new Compound(converter, this);
	return concatConverter === Identity ? converter : Compound.create(concatConverter, converter);
}

export function offset(off: number): UnitConverter {
	return OffsetConverter.create(off);
}

export function factor(f: number): UnitConverter {
	return FactorConverter.create(f);
}

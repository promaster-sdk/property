import * as OffsetConverter from "./unit_converters/offset_converter";
import * as IdentityConverter from "./unit_converters/identity_converter";

export type UnitConverter = OffsetConverter.OffsetConverter | Compound | FactorConverter | IdentityConverter.IdentityConverter;

// This record represents a compound converter.
export interface Compound {
  readonly type: "compound",
  // Holds the first converter.
  readonly first: UnitConverter,
  // Holds the second converter.
  readonly second: UnitConverter,
}

export interface FactorConverter {
  readonly type: "factor",
  readonly factor: number,
}

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
export const Identity: UnitConverter = IdentityConverter.createIdentityConverter();

export function offset(off: number): UnitConverter {
  return OffsetConverter.createOffsetConverter(off);
}

export function factor(f: number): UnitConverter {
  return createFactorConverter(f);
}

/// Returns the inverse of this converter. If x is a valid
/// value, then x == inverse().convert(convert(x)) to within
/// the accuracy of computer arithmetic.
export function inverse(converter: UnitConverter): UnitConverter {
	switch (converter.type) {
		case "compound":
			// return Compound.inverse(converter);
      return createCompoundConverter(inverse(converter.second), inverse(converter.first));
		case "factor":
			// return FactorConverter.inverse(converter);
      return createFactorConverter(1.0 / converter.factor);
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
      return convert(convert(value, converter.first), converter.second);
		case "factor":
      return value * converter.factor;
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
	return concatConverter === Identity ? converter : createCompoundConverter(concatConverter, converter);
}




/// Creates a compound converter resulting from the combined
/// transformation of the specified converters.
/// <param name="first">the first converter.</param>
/// <param name="second">second the second converter.</param>
function createCompoundConverter(first: UnitConverter, second: UnitConverter): Compound {
  return {type: "compound", first, second};
}

/// Inner class FactorConverter
function createFactorConverter(factor: number): FactorConverter {
  if (factor === 1.0)
    throw new Error("Argument: factor " + factor.toString());
  return {type: "factor", factor};
}

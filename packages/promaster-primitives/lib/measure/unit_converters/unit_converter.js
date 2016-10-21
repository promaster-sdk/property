"use strict";
var OffsetConverter = require("./offset_converter");
var Compound = require("./compound_converter");
var FactorConverter = require("./factor_converter");
var IdentityConverter = require("./identity_converter");
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
exports.Identity = IdentityConverter.create();
/// Returns the inverse of this converter. If x is a valid
/// value, then x == inverse().convert(convert(x)) to within
/// the accuracy of computer arithmetic.
function inverse(converter) {
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
exports.inverse = inverse;
/// Converts a double value.
/// <param name="x">the numeric value to convert.</param>
/// <returns>the converted numeric value.</returns>
function convert(value, converter) {
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
exports.convert = convert;
/// Concatenates this converter with another converter. The resulting
/// converter is equivalent to first converting by the specified converter,
/// and then converting by this converter.
///
/// Note: Implementations must ensure that the IDENTITY instance
///       is returned if the resulting converter is an identity
///       converter.
/// <param name="converter">the other converter.</param>
/// <returns>the concatenation of this converter with the other converter.</returns>
function concatenate(concatConverter, converter) {
    //return identical(converter, Identity) ? this : new Compound(converter, this);
    return concatConverter === exports.Identity ? converter : Compound.create(concatConverter, converter);
}
exports.concatenate = concatenate;
function offset(off) {
    return OffsetConverter.create(off);
}
exports.offset = offset;
function factor(f) {
    return FactorConverter.create(f);
}
exports.factor = factor;
//# sourceMappingURL=unit_converter.js.map
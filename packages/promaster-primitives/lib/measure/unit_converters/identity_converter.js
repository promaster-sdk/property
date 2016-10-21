"use strict";
/// This inner class represents the identity converter (singleton).
function create() {
    return { type: "identity" };
}
exports.create = create;
/// Implements abstract method.
function concatenate(converter) {
    return converter;
}
exports.concatenate = concatenate;
/// Implements abstract method.
function convert(value) {
    return value;
}
exports.convert = convert;
/// Implements abstract method.
function inverse(converter) {
    return converter;
}
exports.inverse = inverse;
//# sourceMappingURL=identity_converter.js.map
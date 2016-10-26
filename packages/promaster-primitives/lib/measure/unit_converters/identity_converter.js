"use strict";
/// This inner class represents the identity converter (singleton).
function createIdentityConverter() {
    return { type: "identity" };
}
exports.createIdentityConverter = createIdentityConverter;
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
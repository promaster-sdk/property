"use strict";
/// Inner class FactorConverter
function createFactorConverter(factor) {
    if (factor === 1.0)
        throw new Error("Argument: factor " + factor.toString());
    return { type: "factor", factor: factor };
}
exports.createFactorConverter = createFactorConverter;
function convert(value, converter) {
    return value * converter.factor;
}
exports.convert = convert;
function inverse(converter) {
    return createFactorConverter(1.0 / converter.factor);
}
exports.inverse = inverse;
//# sourceMappingURL=factor_converter.js.map
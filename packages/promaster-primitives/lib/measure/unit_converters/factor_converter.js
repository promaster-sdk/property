"use strict";
var UnitConverter = require("../unit_converter");
/// Inner class FactorConverter
function create(factor) {
    if (factor === 1.0)
        throw new Error("Argument: factor " + factor.toString());
    return { type: "factor", factor: factor };
}
exports.create = create;
function convert(value, converter) {
    return value * converter.factor;
}
exports.convert = convert;
function concatenate(concatConverter, converter) {
    if (concatConverter.type === "factor") {
        var f = converter.factor * concatConverter.factor;
        if (f == 1.0)
            return UnitConverter.Identity;
        return create(f);
    }
    return UnitConverter.concatenate(concatConverter, converter);
}
exports.concatenate = concatenate;
function inverse(converter) {
    return create(1.0 / converter.factor);
}
exports.inverse = inverse;
//# sourceMappingURL=factor_converter.js.map
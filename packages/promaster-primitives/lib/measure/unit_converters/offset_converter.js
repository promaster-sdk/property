"use strict";
var UnitConverter = require("../unit_converter");
/// Inner class OffsetConverter
var EPSILON = 4.94065645841247E-324;
function create(offset) {
    return { type: "offset", offset: offset };
}
exports.create = create;
function convert(value, converter) {
    return value + converter.offset;
}
exports.convert = convert;
function concatenate(concatConverter, converter) {
    if (concatConverter.type === "offset") {
        if (Math.abs(converter.offset - concatConverter.offset) > EPSILON) {
            return create(converter.offset + concatConverter.offset);
        }
        return UnitConverter.Identity;
    }
    return UnitConverter.concatenate(concatConverter, converter);
}
exports.concatenate = concatenate;
function inverse(converter) {
    return create(-converter.offset);
}
exports.inverse = inverse;
//# sourceMappingURL=offset_converter.js.map
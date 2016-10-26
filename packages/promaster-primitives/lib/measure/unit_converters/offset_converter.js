"use strict";
/// Inner class OffsetConverter
var EPSILON = 4.94065645841247E-324;
function createOffsetConverter(offset) {
    return { type: "offset", offset: offset };
}
exports.createOffsetConverter = createOffsetConverter;
function convert(value, converter) {
    return value + converter.offset;
}
exports.convert = convert;
function inverse(converter) {
    return createOffsetConverter(-converter.offset);
}
exports.inverse = inverse;
//# sourceMappingURL=offset_converter.js.map
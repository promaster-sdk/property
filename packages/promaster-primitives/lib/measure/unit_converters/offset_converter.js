"use strict";
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
function inverse(converter) {
    return create(-converter.offset);
}
exports.inverse = inverse;
//# sourceMappingURL=offset_converter.js.map
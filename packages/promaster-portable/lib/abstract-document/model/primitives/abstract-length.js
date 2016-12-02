"use strict";
function createAbstractLength(twips) {
    return {
        twips: twips,
    };
}
exports.createAbstractLength = createAbstractLength;
function fromTwips(twips) {
    return createAbstractLength(twips);
}
exports.fromTwips = fromTwips;
function fromPoints(points) {
    return createAbstractLength(points * 20);
}
exports.fromPoints = fromPoints;
function fromInch(inch) {
    return createAbstractLength(inch * 1440);
}
exports.fromInch = fromInch;
function asTwips(length) {
    return length.twips;
}
exports.asTwips = asTwips;
function asPoints(length) {
    return length.twips / 20;
}
exports.asPoints = asPoints;
function asInch(length) {
    return length.twips / 1440;
}
exports.asInch = asInch;
//# sourceMappingURL=abstract-length.js.map
"use strict";
var PropertyValue = require("../product-properties/property-value");
function newAndExpr(children) {
    return { type: "AndExpr", children: children };
}
exports.newAndExpr = newAndExpr;
function newComparisonExpr(leftValue, operationType, rightValue) {
    return { type: "ComparisonExpr", leftValue: leftValue, operationType: operationType, rightValue: rightValue };
}
exports.newComparisonExpr = newComparisonExpr;
function newEmptyExpr() {
    return { type: "EmptyExpr" };
}
exports.newEmptyExpr = newEmptyExpr;
function newEqualsExpr(leftValue, operationType, rightValueRanges) {
    return { type: "EqualsExpr", leftValue: leftValue, operationType: operationType, rightValueRanges: rightValueRanges };
}
exports.newEqualsExpr = newEqualsExpr;
function newIdentifierExpr(name) {
    return { type: "IdentifierExpr", name: name };
}
exports.newIdentifierExpr = newIdentifierExpr;
function newNullExpr() {
    return { type: "NullExpr" };
}
exports.newNullExpr = newNullExpr;
function newOrExpr(children) {
    return { type: "OrExpr", children: children };
}
exports.newOrExpr = newOrExpr;
function newValueExpr(unParsed) {
    var parsed = PropertyValue.fromString(unParsed);
    if (parsed === undefined)
        throw new Error("Invalid property value " + unParsed);
    return { type: "ValueExpr", unParsed: unParsed, parsed: parsed };
}
exports.newValueExpr = newValueExpr;
function newValueRangeExpr(min, max) {
    return { type: "ValueRangeExpr", min: min, max: max };
}
exports.newValueRangeExpr = newValueRangeExpr;
//# sourceMappingURL=property-filter-ast.js.map
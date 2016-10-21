"use strict";
var Unit = require("../unit");
/// This class represents the units used in expressions to distinguish
/// between quantities of a different nature but of the same dimensions.
///
/// Instances of this class are created through the
/// {@link Unit#alternate(String)} method.
/// Creates an alternate unit for the specified unit identified by the
/// specified symbol.
/// <param name="symbol">the symbol for this alternate unit.</param>
/// <param name="parent">parent the system unit from which this alternate unit is derived.</param>
function create(symbol, parent) {
    return Unit.create(parent.quantity, [], { type: "alternate", symbol: symbol, parent: parent });
    // return {
    // 	quantity: parent.quantity,
    // 	// Init elements to standard, some other constructors can override this by re-setting _elements
    // 	// elements: [new Element(this, 1)],
    // 	elements: [],
    // 	symbol: symbol,
    // 	parent: parent,
    // }
}
exports.create = create;
/// Implements abstract method.
function getStandardUnit(unit) {
    return unit;
}
exports.getStandardUnit = getStandardUnit;
/// Implements abstract method.
function toStandardUnit(unit) {
    return Unit.toStandardUnit(unit.parent);
}
exports.toStandardUnit = toStandardUnit;
function buildDerivedName(unit) {
    return unit.symbol;
}
exports.buildDerivedName = buildDerivedName;
//# sourceMappingURL=alternate_unit.js.map
"use strict";
var UnitConverter = require("../unit_converters/unit_converter");
var Unit = require("../unit");
/// This class represents the building blocks on top of which all others
/// units are created.
/// This class represents the "standard base units" which includes SI base
/// units and possibly others user-defined base units. It does not represent
/// the base units of any specific System Of Units (they would have
/// be base units accross all possible systems otherwise).
/// Creates a base unit having the specified symbol.
/// <param name="symbol">the symbol of this base unit.</param>
function create(quantity, symbol) {
    return Unit.create(quantity, [], { type: "base", symbol: symbol });
    // return {
    // 	quantity,
    // 	// // Init elements to standard, some other constructors can override this by re-setting _elements
    // 	// elements: [new Element(this, 1)],
    // 	elements: [],
    // 	symbol: symbol,
    // }
}
exports.create = create;
/// Indicates if this base unit is considered equals to the specified
/// object (both are base units with equal symbol, standard dimension and
/// standard transform).
/// <param name="that">the object to compare for equality.</param>
/// <returns>true if this and that are considered equals; false otherwise.</returns>
//@override bool operator ==(other) => other is BaseUnit<T> && other._symbol == _symbol;
/// Implements abstract method.
//@override int get hashCode => _symbol.hashCode;
function buildDerivedName(unit) {
    return unit.symbol;
}
exports.buildDerivedName = buildDerivedName;
/// Implements abstract method.
function toStandardUnit() {
    return UnitConverter.Identity;
}
exports.toStandardUnit = toStandardUnit;
/// Implements abstract method.
function getStandardUnit(unit) {
    return unit;
}
exports.getStandardUnit = getStandardUnit;
//# sourceMappingURL=base_unit.js.map
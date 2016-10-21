"use strict";
/// Inner product element represents a rational power of a single unit.
/// Structural constructor.
/// <param name="unit">the unit.</param>
/// <param name="pow">the power exponent.</param>
function create(unit, pow) {
    //if(this._unit instanceof ProductUnit)
    //  throw "Cannot have a product unit in an element.";
    return { unit: unit, pow: pow };
}
exports.create = create;
function toString(element) {
    return "Element: " + element.unit.toString() + ", " + element.pow;
}
exports.toString = toString;
//# sourceMappingURL=element.js.map
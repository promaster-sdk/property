"use strict";
var Unit = require('./unit');
var UnitName = require('./unit-name');
var Units = require("./units");
var compare_utils_1 = require("../utils/compare_utils");
/**
 * Creates an amount that represents the an exact/absolute value in the specified
 * unit. For example if you create an exact amount of 2 degrees Fahrenheit that
 * will represent -16.6666667 degrees Celsius.
 */
function create(value, unit, decimalCount) {
    if (decimalCount === void 0) { decimalCount = undefined; }
    return _factory(value, unit, decimalCount);
}
exports.create = create;
function toString(amount) {
    var unitname = UnitName.getName(amount.unit);
    if (unitname.length > 0)
        return amount.value.toString() + " " + unitname;
    return amount.value.toString();
}
exports.toString = toString;
/** Simulate negation unary operator. */
function neg(amount) {
    return create(-amount.value, amount.unit);
}
exports.neg = neg;
function isQuantity(quantity, amount) {
    // Amount does not store the quanitty but Unit does
    // return Unit.getQuantityType(amount.unit) === quantityType;
    return amount.unit.quantity === quantity;
}
exports.isQuantity = isQuantity;
/**
 * Adds two amounts together.
 * The two amounts amounts must have the same quantity.
 * The resulting amount will be of the same quantity as the two amounts.
 * @param left The left-hand amount.
 * @param right The right-hand
 * @returns left + right
 */
function plus(left, right) {
    return _factory(left.value + valueAs(left.unit, right), left.unit);
}
exports.plus = plus;
function minus(left, right) {
    return _factory(left.value - valueAs(left.unit, right), left.unit);
}
exports.minus = minus;
function times(left, right) {
    if (typeof right === "number")
        return _factory(left.value * right, left.unit);
    else if (right.unit.quantity === "Dimensionless")
        return _factory(left.value * valueAs(Units.One, right), left.unit);
    else
        throw new Error("Cannot perform '*' operation with value of type '" + right + "'.");
}
exports.times = times;
function divide(left, right) {
    if (typeof right === "number")
        return _factory(left.value / right, left.unit);
    else if (right.unit.quantity === "Dimensionless")
        return _factory(left.value / valueAs(Units.One, right), left.unit);
    else
        throw new Error("Cannot perform '*' operation with value of type '" + right + "'.");
}
exports.divide = divide;
/// Comparsion operators
exports.equals = function (left, right) { return _comparison(left, right, true) == 0; };
exports.lessThan = function (left, right) { return _comparison(left, right, false) < 0; };
exports.greaterThan = function (left, right) { return _comparison(left, right, false) > 0; };
exports.lessOrEqualTo = function (left, right) { return _comparison(left, right, false) <= 0; };
exports.greaterOrEqualTo = function (left, right) { return _comparison(left, right, false) >= 0; };
function clamp(minAmount, maxAmount, amount) {
    return min(maxAmount, max(minAmount, amount));
}
exports.clamp = clamp;
function max(a2, amount) {
    if (a2 == null)
        return amount;
    return amount > a2 ? amount : a2;
}
exports.max = max;
function min(a2, amount) {
    if (a2 == null)
        return amount;
    return amount < a2 ? amount : a2;
}
exports.min = min;
function roundDown(step, amount) {
    var div = amount.value / step.value;
    return _factory(Math.floor(div) * step.value, amount.unit);
}
exports.roundDown = roundDown;
function roundUp(step, amount) {
    var div = amount.value / step.value;
    return _factory(Math.ceil(div) * step.value, amount.unit);
}
exports.roundUp = roundUp;
function compareTo(other, amount) {
    return _comparison(amount, other, true);
}
exports.compareTo = compareTo;
/**
 * Gets the absolute amount (equivalent of Math.Abs())
 * @param amount The amount to get the aboslute amount from.
 */
function abs(amount) {
    return _factory(Math.abs(amount.value), amount.unit);
}
exports.abs = abs;
/**
 * Gets the value of the amount as a number in the specified unit
 * @param toUnit The unit to get the amount in.
 * @param amount The amount to get the value from.
 */
function valueAs(toUnit, amount) {
    return Unit.convert(amount.value, amount.unit, toUnit);
}
exports.valueAs = valueAs;
///////////////////////////////
/// BEGIN PRIVATE DECLARATIONS
///////////////////////////////
function _factory(value, unit, decimalCount) {
    if (decimalCount === void 0) { decimalCount = undefined; }
    if (decimalCount === undefined) {
        decimalCount = 0;
        var stringValue = value.toString();
        var pointIndex = stringValue.indexOf('.');
        if (pointIndex >= 0)
            decimalCount = stringValue.length - pointIndex - 1;
    }
    return {
        value: value,
        unit: unit,
        decimalCount: decimalCount
    };
}
function _comparison(a1, a2, allowNullOrUndefined) {
    if (!allowNullOrUndefined) {
        // We don't allow nulls for < and > because it would cause strange behavior, e.g. 1 < null would work which it shouldn't
        if (a1 === null || a1 === undefined)
            throw new Error("ArgumentNull: a1");
        if (a2 === null || a2 === undefined)
            throw new Error("ArgumentNull: a2");
    }
    else {
        // Handle nulls
        if ((a1 === null && a2 === null) || (a1 === undefined && a2 === undefined))
            return 0;
        if (a1 === null || a1 === undefined)
            return 1;
        if (a2 === null || a2 === undefined)
            return 2;
    }
    // Convert the second amount to the same unit as the first and compare the values
    var a1Value = a1.value;
    var a2Value = valueAs(a1.unit, a2);
    return compare_utils_1.compareNumbers(a1Value, a2Value, Math.max(a1.decimalCount, a2.decimalCount));
}
//# sourceMappingURL=amount.js.map
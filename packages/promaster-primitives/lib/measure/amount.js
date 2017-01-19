"use strict";
var Unit = require("./unit");
var UnitName = require("./unit-name");
var Units = require("./units");
var CompareUtils = require("../utils/compare_utils");
/**
 * Creates an amount that represents the an exact/absolute value in the specified
 * unit. For example if you create an exact amount of 2 degrees Fahrenheit that
 * will represent -16.6666667 degrees Celsius.
 * @param value {number} The numeric value of the amount.
 * @param unit {Unit<T>} The unit of the amount.
 * @param decimalCount {number | undefined} The decimalCount of the amount.
 * @returns {Amount<T>} The created amount.
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
function max(a1, a2) {
    if (!a2)
        return a1;
    if (!a1)
        return a2;
    return exports.greaterThan(a1, a2) ? a1 : a2;
}
exports.max = max;
function min(a1, a2) {
    if (!a2)
        return a1;
    if (!a1)
        return a2;
    return exports.lessThan(a1, a2) ? a1 : a2;
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
function compareTo(left, right) {
    return _comparison(left, right, true);
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
    if (typeof value !== "number")
        throw new Error("value must be a number.");
    if (typeof unit !== "object")
        throw new Error("unit must be an object.");
    if (decimalCount !== undefined && typeof decimalCount !== "number")
        throw new Error("decimalCount must be an undefined or a number.");
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
function _comparison(left, right, allowNullOrUndefined) {
    if (!allowNullOrUndefined) {
        // We don't allow nulls for < and > because it would cause strange behavior, e.g. 1 < null would work which it shouldn't
        if (left === null || left === undefined)
            throw new Error("ArgumentNull: left");
        if (right === null || right === undefined)
            throw new Error("ArgumentNull: right");
    }
    else {
        // Handle nulls
        if ((left === null && right === null) || (left === undefined && right === undefined))
            return 0;
        if (left === null || left === undefined)
            return 1;
        if (right === null || right === undefined)
            return 2;
    }
    // Convert the second amount to the same unit as the first and compare the values
    // NOTE: The converted amount may have more decimals, eg. when comparing
    // 0:CubicMeterPerSecond with 36:CubicMeterPerHour, both with 0 decimal places,
    // then 36:CubicMeterPerHour gets converted to 0:CubicMeterPerSecond if the same
    // decimal places are used as in the original amounts
    // Therefore we need to use all decimals for the converted value.
    // Buf if both are of the same unit then no conversion is needed so we can use decimal places from both
    if (Unit.equals(left.unit, right.unit)) {
        return CompareUtils.compareNumbers(left.value, right.value, left.decimalCount, right.decimalCount);
    }
    var rightValue = valueAs(left.unit, right);
    return CompareUtils.compareNumbers(left.value, rightValue, left.decimalCount, left.decimalCount);
}
//# sourceMappingURL=amount.js.map
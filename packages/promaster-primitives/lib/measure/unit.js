"use strict";
var UnitConverter = require("./unit_converter");
/// Creates a base unit having the specified symbol.
/// <param name="symbol">the symbol of this base unit.</param>
function createBase(quantity, symbol) {
    return create(quantity, { type: "base", symbol: symbol });
}
exports.createBase = createBase;
/// Creates an alternate unit for the specified unit identified by the
/// specified symbol.
/// <param name="symbol">the symbol for this alternate unit.</param>
/// <param name="parent">parent the system unit from which this alternate unit is derived.</param>
function createAlternate(symbol, parent) {
    return create(parent.quantity, { type: "alternate", symbol: symbol, parent: parent });
}
exports.createAlternate = createAlternate;
// Used solely to create ONE instance.
function createOne() {
    return create("Dimensionless", { type: "product", elements: [] });
}
exports.createOne = createOne;
// Creates a ProductUnit.
function times(quantity, left, right) {
    return product(quantity, left, right);
}
exports.times = times;
// Creates a ProductUnit.
function divide(quantity, left, right) {
    return quotient(quantity, left, right);
}
exports.divide = divide;
// Simulate operator overload
function timesNumber(factor, unit) {
    return transform(UnitConverter.factor(factor), unit);
}
exports.timesNumber = timesNumber;
// Simulate operator overload
function divideNumber(factor, unit) {
    return transform(UnitConverter.factor(1.0 / factor), unit);
}
exports.divideNumber = divideNumber;
// Simulate operator overload
function plus(offset, unit) {
    return transform(UnitConverter.offset(offset), unit);
}
exports.plus = plus;
// Simulate operator overload
function minus(offset, unit) {
    return transform(UnitConverter.offset(-offset), unit);
}
exports.minus = minus;
/// Returns a converter of numeric values from this unit to another unit.
/// <param name="that">the unit to which to convert the numeric values.</param>
/// <returns>the converter from this unit to <code>that</code> unit.</returns>
function getConverterTo(that, unit) {
    if (unit == that) {
        return UnitConverter.Identity;
    }
    return UnitConverter.concatenate(toStandardUnit(unit), UnitConverter.inverse(toStandardUnit(that)));
}
exports.getConverterTo = getConverterTo;
// Returns the converter from this unit to its system unit.
function toStandardUnit(unit) {
    switch (unit.innerUnit.type) {
        case "alternate":
            return toStandardUnit(unit.innerUnit.parent);
        case "base":
            return UnitConverter.Identity;
        case "product":
            return productUnitToStandardUnit(unit);
        case "transformed":
            return UnitConverter.concatenate(unit.innerUnit.toParentUnitConverter, toStandardUnit(unit.innerUnit.parentUnit));
    }
    throw new Error("Unknown innerUnit " + JSON.stringify(unit));
}
/// Returns the unit derived from this unit using the specified converter.
/// The converter does not need to be linear.
/// <param name="operation">the converter from the transformed unit to this unit.</param>
/// <returns>the unit after the specified transformation.</returns>
function transform(operation, unit) {
    if (operation === UnitConverter.Identity) {
        return unit;
    }
    return createTransformed(unit, operation);
}
/// Creates a transformed unit from the specified parent unit.
/// <param name="parentUnit">the untransformed unit from which this unit is derived.</param>
/// <param name="toParentUnitConverter">the converter to the parent units.</param>
function createTransformed(parentUnit, toParentUnitConverter) {
    return create(parentUnit.quantity, { type: "transformed", parentUnit: parentUnit, toParentUnitConverter: toParentUnitConverter });
}
function create(quantity, innerUnit) {
    return { quantity: quantity, innerUnit: innerUnit };
}
/// Creates the unit defined from the product of the specifed elements.
/// <param name="leftElems">left multiplicand elements</param>
/// <param name="rightElems">right multiplicand elements.</param>
function fromProduct(quantity, leftElems, rightElems) {
    // If we have several elements of the same unit then we can merge them by summing their power
    var allElements = [];
    allElements.push.apply(allElements, leftElems);
    allElements.push.apply(allElements, rightElems);
    var resultElements = [];
    var unitGroups = new Map();
    allElements.forEach(function (v) {
        var group = unitGroups.get(v.unit);
        if (group === undefined)
            unitGroups.set(v.unit, [v]);
        else
            group.push(v);
    });
    unitGroups.forEach(function (unitGroup, unit) {
        var sumpow = unitGroup.reduce(function (prev, element) { return prev + element.pow; }, 0);
        if (sumpow != 0) {
            resultElements.push(createElement(unit, sumpow));
        }
    });
    return createProductUnit(quantity, resultElements);
}
function createElement(unit, pow) {
    return { unit: unit, pow: pow };
}
/// <summary>
/// Returns the product of the specified units.
/// </summary>
/// <param name="left">the left unit operand.</param>
/// <param name="right">the right unit operand.</param>
/// <returns>left * right</returns>
function product(quantity, left, right) {
    var leftelements = getElements(left);
    var rightelements = getElements(right);
    return fromProduct(quantity, leftelements, rightelements);
}
/// Returns the quotient of the specified units.
/// <param name="left">the dividend unit operand.</param>
/// <param name="right">right the divisor unit operand.</param>
/// <returns>dividend / divisor</returns>
function quotient(quantity, left, right) {
    var leftelements = getElements(left);
    var invertedRightelements = [];
    for (var _i = 0, _a = getElements(right); _i < _a.length; _i++) {
        var element = _a[_i];
        invertedRightelements.push(createElement(element.unit, -element.pow));
    }
    return fromProduct(quantity, leftelements, invertedRightelements);
}
function getElements(unit) {
    if (unit.innerUnit.type === "product") {
        return unit.innerUnit.elements;
    }
    return [];
}
function productUnitToStandardUnit(unit) {
    var converter = UnitConverter.Identity;
    for (var _i = 0, _a = getElements(unit); _i < _a.length; _i++) {
        var element = _a[_i];
        var conv = toStandardUnit(element.unit);
        var pow = element.pow;
        if (pow < 0) {
            pow = -pow;
            conv = UnitConverter.inverse(conv);
        }
        for (var i = 1; i <= pow; i++) {
            converter = UnitConverter.concatenate(conv, converter);
        }
    }
    return converter;
}
/// Product unit constructor.
/// <param name="elements">the product elements.</param>
function createProductUnit(quantity, elements) {
    return create(quantity, { type: "product", elements: elements });
}
//# sourceMappingURL=unit.js.map
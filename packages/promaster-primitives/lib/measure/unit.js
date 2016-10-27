"use strict";
/** Holds the dimensionless unit ONE */
exports.One = createOne();
/** Holds the identity converter (unique). This converter does nothing (ONE.convert(x) == x). */
var identityConverter = createIdentityConverter();
/**
 * Creates a base unit having the specified symbol.
 * @param quantity The quantity of the resulting unit.
 * @param symbol The symbol of this base unit.
 */
function createBase(quantity, symbol) {
    return create(quantity, { type: "base", symbol: symbol });
}
exports.createBase = createBase;
/**
 * Creates an alternate unit for the specified unit identified by the
 * specified symbol.
 * @param symbol The symbol for this alternate unit.
 * @param parent Parent the system unit from which this alternate unit is derived.
 */
function createAlternate(symbol, parent) {
    return create(parent.quantity, { type: "alternate", symbol: symbol, parent: parent });
}
exports.createAlternate = createAlternate;
/**
 * Returns the product of the specified units.
 * @param quantity The quantity of the resulting unit.
 * @param left The left unit operand.
 * @param right The right unit operand.</param>
 * @returns left * right
*/
function times(quantity, left, right) {
    return product(quantity, left, right);
}
exports.times = times;
/**
 * Returns the quotient of the specified units.
 * @param quantity The quantity of the resulting unit.
§* * @param left The dividend unit operand.
 * @param right The divisor unit operand.
 * @returns left / right
 */
function divide(quantity, left, right) {
    return quotient(quantity, left, right);
}
exports.divide = divide;
function timesNumber(factor, unit) {
    return transform(createFactorConverter(factor), unit);
}
exports.timesNumber = timesNumber;
function divideNumber(factor, unit) {
    return transform(createFactorConverter(1.0 / factor), unit);
}
exports.divideNumber = divideNumber;
function plus(offset, unit) {
    return transform(createOffsetConverter(offset), unit);
}
exports.plus = plus;
function minus(offset, unit) {
    return transform(createOffsetConverter(-offset), unit);
}
exports.minus = minus;
/**
 * Converts numeric values from a unit to another unit.
 * @param value The numeric value to convert.
 * @param fromUnit The unit from which to convert the numeric value.
 * @param toUnit The unit to which to convert the numeric value.
 * @returns The converted numeric value.
 */
function convert(value, fromUnit, toUnit) {
    var converter = getConverterTo(toUnit, fromUnit);
    return convertWithConverter(value, converter);
}
exports.convert = convert;
///////////////////////////////
/// BEGIN PRIVATE DECLARATIONS
///////////////////////////////
function getConverterTo(toUnit, unit) {
    if (unit == toUnit) {
        return identityConverter;
    }
    return concatenateConverters(toStandardUnit(unit), inverseConverter(toStandardUnit(toUnit)));
}
// Returns the converter from this unit to its system unit.
function toStandardUnit(unit) {
    switch (unit.innerUnit.type) {
        case "alternate":
            return toStandardUnit(unit.innerUnit.parent);
        case "base":
            return identityConverter;
        case "product":
            return productUnitToStandardUnit(unit);
        case "transformed":
            return concatenateConverters(unit.innerUnit.toParentUnitConverter, toStandardUnit(unit.innerUnit.parentUnit));
    }
    throw new Error("Unknown innerUnit " + JSON.stringify(unit));
}
/// Returns the unit derived from this unit using the specified converter.
/// The converter does not need to be linear.
/// <param name="operation">the converter from the transformed unit to this unit.</param>
/// <returns>the unit after the specified transformation.</returns>
function transform(operation, unit) {
    if (operation === identityConverter) {
        return unit;
    }
    return createTransformedUnit(unit, operation);
}
/// Creates a transformed unit from the specified parent unit.
/// <param name="parentUnit">the untransformed unit from which this unit is derived.</param>
/// <param name="toParentUnitConverter">the converter to the parent units.</param>
function createTransformedUnit(parentUnit, toParentUnitConverter) {
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
function product(quantity, left, right) {
    var leftelements = getElements(left);
    var rightelements = getElements(right);
    return fromProduct(quantity, leftelements, rightelements);
}
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
    var converter = identityConverter;
    for (var _i = 0, _a = getElements(unit); _i < _a.length; _i++) {
        var element = _a[_i];
        var conv = toStandardUnit(element.unit);
        var pow = element.pow;
        if (pow < 0) {
            pow = -pow;
            conv = inverseConverter(conv);
        }
        for (var i = 1; i <= pow; i++) {
            converter = concatenateConverters(conv, converter);
        }
    }
    return converter;
}
/// Product unit constructor.
/// <param name="elements">the product elements.</param>
function createProductUnit(quantity, elements) {
    return create(quantity, { type: "product", elements: elements });
}
/// Creates a compound converter resulting from the combined
/// transformation of the specified converters.
/// <param name="first">the first converter.</param>
/// <param name="second">second the second converter.</param>
function createCompoundConverter(first, second) {
    return { type: "compound", first: first, second: second };
}
function createIdentityConverter() {
    return { type: "identity" };
}
function createOffsetConverter(offset) {
    return { type: "offset", offset: offset };
}
function createFactorConverter(factor) {
    if (factor === 1.0)
        throw new Error("Argument: factor " + factor.toString());
    return { type: "factor", factor: factor };
}
/// Returns the inverse of this converter. If x is a valid
/// value, then x == inverse().convert(convert(x)) to within
/// the accuracy of computer arithmetic.
function inverseConverter(converter) {
    switch (converter.type) {
        case "compound":
            return createCompoundConverter(inverseConverter(converter.second), inverseConverter(converter.first));
        case "factor":
            return createFactorConverter(1.0 / converter.factor);
        case "identity":
            return converter;
        case "offset":
            return createOffsetConverter(-converter.offset);
    }
    throw new Error("Unknown unit converter");
}
/// Converts a double value.
/// <param name="x">the numeric value to convert.</param>
/// <returns>the converted numeric value.</returns>
function convertWithConverter(value, converter) {
    switch (converter.type) {
        case "compound":
            return convertWithConverter(convertWithConverter(value, converter.first), converter.second);
        case "factor":
            return value * converter.factor;
        case "identity":
            return value;
        case "offset":
            return value + converter.offset;
    }
    throw new Error("Unknown unit converter");
}
/// Concatenates this converter with another converter. The resulting
/// converter is equivalent to first converting by the specified converter,
/// and then converting by this converter.
///
/// Note: Implementations must ensure that the IDENTITY instance
///       is returned if the resulting converter is an identity
///       converter.
/// <param name="converter">the other converter.</param>
/// <returns>the concatenation of this converter with the other converter.</returns>
function concatenateConverters(concatConverter, converter) {
    return concatConverter === identityConverter ? converter : createCompoundConverter(concatConverter, converter);
}
// Used solely to create ONE instance.
function createOne() {
    return create("Dimensionless", { type: "product", elements: [] });
}
//# sourceMappingURL=unit.js.map
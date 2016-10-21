"use strict";
var UnitConverter = require("./unit_converters/unit_converter");
var TransformedUnit = require("./units/transformed_unit");
var ProductUnit = require("./units/product_unit");
var AlternateUnit = require("./units/alternate_unit");
var BaseUnit = require("./units/base_unit");
/// This class represents a determinate quantity (as of length, time, heat, or value)
/// adopted as a standard of measurement.
///
/// It is helpful to think of instances of this class as recording the history by which
/// they are created. Thus, for example, the string "g/kg" (which is a dimensionless unit)
/// would result from invoking the method toString() on a unit that was created by
/// dividing a gram unit by a kilogram unit. Yet, "kg" divided by "kg" returns ONE and
/// not "kg/kg" due to automatic unit factorization.
///
/// This class supports the multiplication of offsets units. The result is usually a unit
/// not convertible to its standard unit. Such units may appear in derivative quantities.
/// For example °C/m is an unit of gradient, which is common in atmospheric and oceanographic research.
///
/// Units raised at rational powers are also supported. For example the cubic root of liter
/// is a unit compatible with meter.
///
/// Instances of this class and sub-classes are immutable.
/// Holds the dimensionless unit ONE
//public static readonly Unit<T> One = new ProductUnit<T>();
/// We keep a global repository of Labels becasue if a Unit object is derived from arithmetic operations
/// it may still be considered equal to an existing unit and thus should have the same label.
var _typeLabels = new Map();
function create(quantity, elements, innerUnit) {
    return {
        quantity: quantity,
        // // Init elements to standard, some other constructors can override this by re-setting _elements
        // elements: [createElement(this, 1)],
        elements: elements,
        innerUnit: innerUnit
    };
}
exports.create = create;
function getLabel(unit) {
    var label = _typeLabels.get(unit);
    if (label === undefined)
        return "";
    return label;
}
exports.getLabel = getLabel;
/// Creates a ProductUnit.
function times(quantity, u) {
    return ProductUnit.Product(quantity, this, u);
}
exports.times = times;
/// Creates a ProductUnit.
function divide(quantity, u) {
    return ProductUnit.Quotient(quantity, this, u);
}
exports.divide = divide;
/// Returns the BaseUnit, AlternateUnit or product of base units
/// and alternate units this unit is derived
/// from. The standard unit identifies the "type" of
/// Quantity for which this unit is employed.
// TYPESCRIPT DOES NOT SUPPORT abstract getters
// TODO: Make this an abstract method instead of a getter...
function getStandardUnit(unit) {
    throw new Error("This is abstract (which is not supported by TS).");
}
exports.getStandardUnit = getStandardUnit;
// /// Returns the converter from this unit to its system unit.
// abstract toStandardUnit():UnitConverter;
function toStandardUnit(unit) {
    switch (unit.innerUnit.type) {
        case "alternate":
            return AlternateUnit.toStandardUnit(unit.innerUnit);
        case "base":
            return BaseUnit.toStandardUnit();
        case "product":
            return ProductUnit.toStandardUnit(unit);
        case "transformed":
            return TransformedUnit.toStandardUnit(unit.innerUnit);
    }
    throw new Error("Unknown innerUnit " + JSON.stringify(unit));
}
exports.toStandardUnit = toStandardUnit;
/// Indicates if this unit is a standard unit (base units and
/// alternate units are standard units). The standard unit identifies
/// the "type" of {@link javax.measure.quantity.Quantity quantity} for
/// which the unit is employed.
/// <returns><code>getStandardUnit().equals(this)</code></returns>
function isStandardUnit(unit) {
    return getStandardUnit(unit) === unit;
}
exports.isStandardUnit = isStandardUnit;
/// Returns a converter of numeric values from this unit to another unit.
/// <param name="that">the unit to which to convert the numeric values.</param>
/// <returns>the converter from this unit to <code>that</code> unit.</returns>
function getConverterTo(that, unit) {
    if (this == that) {
        return UnitConverter.Identity;
    }
    return UnitConverter.concatenate(toStandardUnit(unit), UnitConverter.inverse(toStandardUnit(that)));
}
exports.getConverterTo = getConverterTo;
/// ProductUnit overrides this because it has multiple elements
function getElements(unit) {
    return unit.elements;
}
exports.getElements = getElements;
function toString(unit) {
    return getName(unit);
}
exports.toString = toString;
function getQuantityType(unit) {
    return unit.quantity;
}
exports.getQuantityType = getQuantityType;
function getName(unit) {
    var label = getLabel(unit);
    if (label === undefined)
        return buildDerivedName(unit);
    return label;
}
exports.getName = getName;
function buildDerivedName(unit) {
    return "";
}
exports.buildDerivedName = buildDerivedName;
function withLabel(label, unit) {
    _typeLabels.set(unit, label);
    return unit;
}
exports.withLabel = withLabel;
/// Returns the unit derived from this unit using the specified converter.
/// The converter does not need to be linear.
/// <param name="operation">the converter from the transformed unit to this unit.</param>
/// <returns>the unit after the specified transformation.</returns>
function transform(operation, unit) {
    //if (identical(operation, UnitConverter.Identity)) {
    //  return this;
    //}
    if (operation === UnitConverter.Identity) {
        return this;
    }
    return TransformedUnit.create(unit, operation);
}
exports.transform = transform;
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
//# sourceMappingURL=unit.js.map
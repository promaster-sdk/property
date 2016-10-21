"use strict";
var UnitConverter = require("../unit_converters/unit_converter");
var Unit = require("../unit");
/// This class represents the units derived from other units using
/// UnitConverter converters.
///
/// Examples of transformed units:
///       CELSIUS = KELVIN.add(273.15);
///       FOOT = METER.multiply(0.3048);
///       MILLISECOND = MILLI(SECOND);
///
///
/// Transformed units have no label. But like any other units,
///  they may have labels attached to them:
///       UnitFormat.getStandardInstance().label(FOOT, "ft");
///
///   or aliases:
///       UnitFormat.getStandardInstance().alias(CENTI(METER)), "centimeter");
///       UnitFormat.getStandardInstance().alias(CENTI(METER)), "centimetre");
///
/// Creates a transformed unit from the specified parent unit.
/// <param name="parentUnit">the untransformed unit from which this unit is derived.</param>
/// <param name="toParentUnitConverter">the converter to the parent units.</param>
function create(parentUnit, toParentUnitConverter) {
    return Unit.create(parentUnit.quantity, [], { type: "transformed", parentUnit: parentUnit, toParentUnitConverter: toParentUnitConverter });
}
exports.create = create;
/// Implements abstract method.
function getStandardUnit(unit) {
    return Unit.getStandardUnit(unit.parentUnit);
}
exports.getStandardUnit = getStandardUnit;
/// Implements abstract method.
function toStandardUnit(unit) {
    return UnitConverter.concatenate(unit.toParentUnitConverter, Unit.toStandardUnit(unit.parentUnit));
}
exports.toStandardUnit = toStandardUnit;
/// Factory method
function transform(operation, unit) {
    var tmptoparent = UnitConverter.concatenate(operation, unit.toParentUnitConverter);
    //if (identical(tmptoparent, UnitConverter.Identity)) {
    //  return this._parentUnit;
    //}
    if (tmptoparent === UnitConverter.Identity) {
        return unit.parentUnit;
    }
    return create(unit.parentUnit, tmptoparent);
}
exports.transform = transform;
//# sourceMappingURL=transformed_unit.js.map
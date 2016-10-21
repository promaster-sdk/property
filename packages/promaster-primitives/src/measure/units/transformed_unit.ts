import {Quantity} from "../quantity";
import * as UnitConverter from "../unit_converters/unit_converter";
import * as Unit from "../unit";

export interface TransformedUnit<T extends Quantity> {
	readonly type: "transformed",
	/// Holds the parent unit (not a transformed unit).
	readonly parentUnit: Unit.Unit<T>,
	/// Holds the converter to the parent unit.
	readonly toParentUnitConverter: UnitConverter.UnitConverter,
}


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
export function create<T extends Quantity>(parentUnit: Unit.Unit<T>, toParentUnitConverter): Unit.Unit<T> {
	return Unit.create(parentUnit.quantity, [], {type: "transformed", parentUnit, toParentUnitConverter} as TransformedUnit<T>);
}

/// Implements abstract method.
export function getStandardUnit<T extends Quantity>(unit: TransformedUnit<T>): Unit.Unit<any> {
	return Unit.getStandardUnit(unit.parentUnit);
}

/// Implements abstract method.
export function toStandardUnit<T extends Quantity>(unit: TransformedUnit<T>): UnitConverter.UnitConverter {
	return UnitConverter.concatenate(unit.toParentUnitConverter, Unit.toStandardUnit(unit.parentUnit));
}

/// Factory method
export function transform<T extends Quantity>(operation: UnitConverter.UnitConverter, unit: TransformedUnit<T>): Unit.Unit<T> {
	var tmptoparent = UnitConverter.concatenate(operation, unit.toParentUnitConverter);
	//if (identical(tmptoparent, UnitConverter.Identity)) {
	//  return this._parentUnit;
	//}
	if (tmptoparent === UnitConverter.Identity) {
		return unit.parentUnit;
	}
	return create(unit.parentUnit, tmptoparent);
}


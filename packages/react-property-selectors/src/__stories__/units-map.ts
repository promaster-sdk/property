import { UnitFormat, BaseUnits, UnitPrefix } from "uom";

export const units = {
  Meter: BaseUnits.Meter,
  CentiMeter: UnitPrefix.Centi("CentiMeter", BaseUnits.Meter),
  Millimeter: UnitPrefix.Milli("Millimeter", BaseUnits.Meter),
};

export const unitsFormat: UnitFormat.UnitFormatMap = {
  Meter: UnitFormat.createUnitFormat("m", 2),
  CentiMeter: UnitFormat.createUnitFormat("cm", 2),
  Millimeter: UnitFormat.createUnitFormat("mm", 2),
};

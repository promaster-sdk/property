import { Unit, UnitFormat, BaseUnits } from "uom";

export const units: Unit.UnitMap = BaseUnits;
export const unitsFormat: UnitFormat.UnitFormatMap = {
  Meter: UnitFormat.createUnitFormat("m", 2)
};

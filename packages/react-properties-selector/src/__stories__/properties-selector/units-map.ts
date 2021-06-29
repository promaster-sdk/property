import { UnitMap, UnitFormat, BaseUnits } from "uom";

export const units: UnitMap.UnitMap = BaseUnits;
export const unitsFormat: UnitFormat.UnitFormatMap = {
  Meter: UnitFormat.createUnitFormat("m", 2),
};

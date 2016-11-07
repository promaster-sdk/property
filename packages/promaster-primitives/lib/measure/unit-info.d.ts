import * as Unit from "./unit";
export interface UnitInfo {
    readonly decimalCount: number;
    readonly coUnit: Unit.Unit<any>;
}
export declare type MeasureSystem = "SI" | "IP";
export declare const getUnitInfo: (unit: Unit.Unit<any>) => UnitInfo;
export declare const getSiUnitInfo: (unit: Unit.Unit<any>) => UnitInfo;
export declare const getIpUnitInfo: (unit: Unit.Unit<any>) => UnitInfo;

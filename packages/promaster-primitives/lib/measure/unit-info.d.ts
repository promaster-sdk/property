import * as Unit from "./unit";
export declare type MeasureSystem = "SI" | "IP";
export interface UnitInfo {
    readonly measureSystem: MeasureSystem;
    readonly decimalCount: number;
    readonly coUnit: Unit.Unit<any>;
}
export declare const getUnitInfo: (unit: Unit.Unit<any>) => UnitInfo;

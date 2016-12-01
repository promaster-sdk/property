import * as Unit from "./unit";
export declare type MeasureSystem = "SI" | "IP";
export interface UnitInfo {
    readonly measureSystem: MeasureSystem | undefined;
    readonly decimalCount: number;
    readonly coUnit?: Unit.Unit<any>;
}
export declare function getUnitInfo(unit: Unit.Unit<any>): UnitInfo | undefined;

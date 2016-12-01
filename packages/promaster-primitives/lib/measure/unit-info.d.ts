import * as Unit from "./unit";
export interface UnitInfo {
    readonly decimalCount: number;
    readonly coUnit?: Unit.Unit<any>;
}
export declare function getUnitInfo(unit: Unit.Unit<any>): UnitInfo | undefined;

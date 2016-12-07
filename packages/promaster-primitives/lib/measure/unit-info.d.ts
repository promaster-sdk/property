import * as Unit from "./unit";
import * as Quantity from "./quantity";
export declare type MeasureSystem = "SI" | "IP";
export interface UnitInfo {
    readonly measureSystem: MeasureSystem | undefined;
    readonly decimalCount: number;
    readonly coUnit?: Unit.Unit<any>;
}
export declare function getUnitInfo(unit: Unit.Unit<any>): UnitInfo | undefined;
export declare function addUnit<T extends Quantity.Quantity>(unit: Unit.Unit<T>, measureSystem: MeasureSystem | undefined, decimalCount: number, coUnit?: Unit.Unit<T>): void;

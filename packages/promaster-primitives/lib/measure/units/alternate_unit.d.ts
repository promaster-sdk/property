import { Quantity } from "../quantity";
import { UnitConverter } from "../unit_converters/unit_converter";
import * as Unit from "../unit";
export interface AlternateUnit<T extends Quantity> {
    readonly type: "alternate";
    readonly symbol: string;
    readonly parent: Unit.Unit<any>;
}
export declare function create<T extends Quantity>(symbol: string, parent: Unit.Unit<any>): Unit.Unit<T>;
export declare function getStandardUnit<T extends Quantity>(unit: Unit.Unit<T>): Unit.Unit<any>;
export declare function toStandardUnit<T extends Quantity>(unit: AlternateUnit<T>): UnitConverter;
export declare function buildDerivedName<T extends Quantity>(unit: AlternateUnit<T>): string;

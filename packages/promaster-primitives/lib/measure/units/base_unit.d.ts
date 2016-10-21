import { Quantity } from "../quantity";
import * as UnitConverter from "../unit_converters/unit_converter";
import * as Unit from "../unit";
export interface BaseUnit<T extends Quantity> {
    readonly type: "base";
    readonly symbol: string;
}
export declare function create<T extends Quantity>(quantity: T, symbol: string): Unit.Unit<T>;
export declare function buildDerivedName<T extends Quantity>(unit: BaseUnit<T>): string;
export declare function toStandardUnit<T extends Quantity>(): UnitConverter.UnitConverter;
export declare function getStandardUnit<T extends Quantity>(unit: Unit.Unit<T>): Unit.Unit<any>;

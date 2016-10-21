import { Quantity } from "../quantity";
import * as UnitConverter from "../unit_converters/unit_converter";
import * as Unit from "../unit";
export interface TransformedUnit<T extends Quantity> {
    readonly type: "transformed";
    readonly parentUnit: Unit.Unit<T>;
    readonly toParentUnitConverter: UnitConverter.UnitConverter;
}
export declare function create<T extends Quantity>(parentUnit: Unit.Unit<T>, toParentUnitConverter: any): Unit.Unit<T>;
export declare function getStandardUnit<T extends Quantity>(unit: TransformedUnit<T>): Unit.Unit<any>;
export declare function toStandardUnit<T extends Quantity>(unit: TransformedUnit<T>): UnitConverter.UnitConverter;
export declare function transform<T extends Quantity>(operation: UnitConverter.UnitConverter, unit: TransformedUnit<T>): Unit.Unit<T>;

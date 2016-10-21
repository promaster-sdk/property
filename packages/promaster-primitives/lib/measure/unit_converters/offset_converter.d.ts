import * as UnitConverter from "./unit_converter";
export interface OffsetConverter {
    readonly type: "offset";
    readonly offset: number;
}
export declare function create(offset: number): OffsetConverter;
export declare function convert(value: number, converter: OffsetConverter): number;
export declare function concatenate(concatConverter: UnitConverter.UnitConverter, converter: OffsetConverter): UnitConverter.UnitConverter;
export declare function inverse(converter: OffsetConverter): UnitConverter.UnitConverter;

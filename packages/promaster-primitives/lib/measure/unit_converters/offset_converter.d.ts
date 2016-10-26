import * as UnitConverter from "../unit_converter";
export interface OffsetConverter {
    readonly type: "offset";
    readonly offset: number;
}
export declare function createOffsetConverter(offset: number): OffsetConverter;
export declare function convert(value: number, converter: OffsetConverter): number;
export declare function inverse(converter: OffsetConverter): UnitConverter.UnitConverter;

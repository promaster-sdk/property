import * as UnitConverter from "../unit_converter";
export interface FactorConverter {
    readonly type: "factor";
    readonly factor: number;
}
export declare function createFactorConverter(factor: number): FactorConverter;
export declare function convert(value: number, converter: FactorConverter): number;
export declare function inverse(converter: FactorConverter): UnitConverter.UnitConverter;

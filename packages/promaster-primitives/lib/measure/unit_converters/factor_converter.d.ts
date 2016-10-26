import * as UnitConverter from "../unit_converter";
export interface FactorConverter {
    readonly type: "factor";
    readonly factor: number;
}
export declare function create(factor: number): FactorConverter;
export declare function convert(value: number, converter: FactorConverter): number;
export declare function concatenate(concatConverter: UnitConverter.UnitConverter, converter: FactorConverter): UnitConverter.UnitConverter;
export declare function inverse(converter: FactorConverter): UnitConverter.UnitConverter;
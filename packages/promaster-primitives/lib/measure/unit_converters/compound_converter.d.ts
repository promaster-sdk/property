import * as UnitConverter from "../unit_converter";
export interface Compound {
    readonly type: "compound";
    readonly first: UnitConverter.UnitConverter;
    readonly second: UnitConverter.UnitConverter;
}
export declare function createCompoundConverter(first: UnitConverter.UnitConverter, second: UnitConverter.UnitConverter): Compound;
export declare function convert(value: number, converter: Compound): number;
export declare function inverse(converter: Compound): UnitConverter.UnitConverter;

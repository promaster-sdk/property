import { UnitConverter } from "../unit_converter";
export interface IdentityConverter {
    readonly type: "identity";
}
export declare function create(): IdentityConverter;
export declare function concatenate(converter: UnitConverter): UnitConverter;
export declare function convert(value: number): number;
export declare function inverse(converter: IdentityConverter): UnitConverter;

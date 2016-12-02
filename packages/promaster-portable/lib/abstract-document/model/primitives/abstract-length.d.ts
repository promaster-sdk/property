export interface AbstractLength {
    readonly twips: number;
}
export declare function createAbstractLength(twips: number): AbstractLength;
export declare function fromTwips(twips: number): AbstractLength;
export declare function fromPoints(points: number): AbstractLength;
export declare function fromInch(inch: number): AbstractLength;
export declare function asTwips(length: AbstractLength): number;
export declare function asPoints(length: AbstractLength): number;
export declare function asInch(length: AbstractLength): number;

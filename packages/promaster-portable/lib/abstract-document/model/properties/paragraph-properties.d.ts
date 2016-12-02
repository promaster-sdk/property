import { TextAlignment } from "../enums/text-alignment";
import { AbstractLength } from "../primitives/abstract-length";
export interface ParagraphProperties {
    alignment: TextAlignment | undefined;
    spacingAfter: any | undefined;
    spacingBefore: any | undefined;
}
export declare function createParagraphProperties(alignment: TextAlignment | undefined, spacingBefore: AbstractLength | undefined, spacingAfter: AbstractLength | undefined): ParagraphProperties;

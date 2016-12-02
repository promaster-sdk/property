import { TextAlignment } from "../model/enums/text-alignment";
import { ParagraphProperties } from "../model/properties/paragraph-properties";
import { AbstractLength } from "../model/primitives/abstract-length";
export declare class ParagraphPropertiesBuilder {
    alignment: TextAlignment | undefined;
    spacingBefore: AbstractLength | undefined;
    spacingAfter: AbstractLength | undefined;
    build(): ParagraphProperties;
}

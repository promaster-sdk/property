import { TextPropertiesBuilder } from "./text-properties-builder";
import { ParagraphStyle } from "../model/styles/paragraph-style";
import { ParagraphPropertiesBuilder } from "./paragraph-properties-builder";
export declare class ParagraphStyleBuilder {
    basedOn: string;
    readonly paragraphProperties: ParagraphPropertiesBuilder;
    readonly textProperties: TextPropertiesBuilder;
    build(): ParagraphStyle;
}

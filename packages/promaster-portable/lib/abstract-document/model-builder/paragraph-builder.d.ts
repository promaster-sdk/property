import { ParagraphNumbering } from "../model/section-elements/paragraph-numbering";
import { ParagraphPropertiesBuilder } from "./paragraph-properties-builder";
import { TextPropertiesBuilder } from "./text-properties-builder";
import { Paragraph } from "../model/section-elements/paragraph";
import { Atom } from "../model/atoms/atom";
import { IBuilder } from "./i-builder";
export declare class ParagraphBuilder implements IBuilder<Atom> {
    builderType: "ParagraphBuilder";
    builtType: "Atom";
    styleName: string;
    numbering: ParagraphNumbering;
    private readonly list;
    add(child: Atom): void;
    readonly paragraphProperties: ParagraphPropertiesBuilder;
    readonly textProperties: TextPropertiesBuilder;
    build(): Paragraph;
}

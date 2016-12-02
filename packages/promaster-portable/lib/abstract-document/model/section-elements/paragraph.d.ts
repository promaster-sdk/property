import { TextProperties } from "../properties/text-properties";
import { ParagraphProperties } from "../properties/paragraph-properties";
import { Atom } from "../atoms/atom";
import { ParagraphNumbering } from "./paragraph-numbering";
import { StyleKey } from "../styles/style-key";
import { Style } from "../styles/style";
import { Indexer } from "../abstract-doc";
export interface Paragraph {
    type: "Paragraph";
    atoms: Atom[];
    numbering: ParagraphNumbering;
    paragraphProperties: ParagraphProperties;
    styleName: string;
    textProperties: TextProperties;
}
export declare function createParagraph(styleName: string, paragraphProperties: ParagraphProperties, textProperties: TextProperties, atoms: Array<Atom>, numbering: ParagraphNumbering): Paragraph;
export declare function getEffectiveParagraphProperties(styles: Indexer<StyleKey, Style>, p: Paragraph): ParagraphProperties;
export declare function getEffectiveTextProperties(styles: Indexer<StyleKey, Style>, p: Paragraph): TextProperties;

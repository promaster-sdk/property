import {TextProperties} from "../properties/text-properties";
import {ParagraphProperties} from "../properties/paragraph-properties";
import {Atom} from "../atoms/atom";
import {ParagraphNumbering} from "./paragraph-numbering";

export interface Paragraph {
  type: "Paragraph",
  atoms: Atom[],
  numbering: ParagraphNumbering,
  paragraphProperties: ParagraphProperties,
  styleName: string,
  textProperties: TextProperties,
}

export function createParagraph(styleName: string, paragraphProperties: ParagraphProperties, textProperties: TextProperties,
                                atoms: Array<Atom>, numbering: ParagraphNumbering): Paragraph {
  return {
    type: "Paragraph",
    styleName,
    paragraphProperties,
    textProperties,
    atoms,
    numbering,
  };
}

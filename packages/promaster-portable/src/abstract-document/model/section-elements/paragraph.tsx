import {TextProperties} from "../properties/text-properties";
import {ParagraphProperties} from "../properties/paragraph-properties";
import {IAtom} from "../atoms/atom";
import {ParagraphNumbering} from "./paragraph-numbering";

export interface Paragraph {
  atoms: IAtom[];
  numbering: ParagraphNumbering;
  paragraphProperties: ParagraphProperties;
  styleName: string;
  textProperties: TextProperties;
}

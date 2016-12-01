import {TextProperties} from "../properties/text-properties";
import {ParagraphProperties} from "../properties/paragraph-properties";
import {Style} from "./style";

export interface ParagraphStyle extends Style {
  paragraphProperties: ParagraphProperties,
  textProperties: TextProperties,
}

export function createParagraphStyle(basedOn: string | undefined, paragraphProperties: ParagraphProperties, textProperties: TextProperties): ParagraphStyle {
  return {
    basedOn,
    paragraphProperties,
    textProperties,
  };
}

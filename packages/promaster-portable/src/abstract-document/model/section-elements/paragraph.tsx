import {TextProperties} from "../properties/text-properties";
import {ParagraphProperties} from "../properties/paragraph-properties";
import {Atom} from "../atoms/atom";
import {ParagraphNumbering} from "./paragraph-numbering";
import {StyleKey} from "../styles/style-key";
import {Style, GetEffectiveStyle2} from "../styles/style";
import {ParagraphStyle, createParagraphStyle} from "../styles/paragraph-style";

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

export function getEffectiveParagraphProperties(styles: Map<StyleKey, Style>, p:Paragraph): ParagraphProperties {
  const effectiveStyle = getEffectiveStyle(styles, p);
  return effectiveStyle.paragraphProperties;
}

export function getEffectiveTextProperties(styles: Map<StyleKey, Style>, p:Paragraph): TextProperties {
  const effectiveStyle = getEffectiveStyle(styles, p);
  return effectiveStyle.textProperties;
}

function getEffectiveStyle(styles: Map<StyleKey, Style>, p:Paragraph): ParagraphStyle {
  const localStyle = createParagraphStyle(p.styleName, p.paragraphProperties, p.textProperties);
  const effectiveStyle = GetEffectiveStyle2<ParagraphStyle>(styles, localStyle);
  return effectiveStyle;
}

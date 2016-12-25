import {TextProperties} from "../properties/text-properties";
import {ParagraphProperties} from "../properties/paragraph-properties";
import {Atom} from "../atoms/atom";
import {ParagraphNumbering} from "./paragraph-numbering";
import {StyleKey} from "../styles/style-key";
import {Style, getEffectiveStyle2} from "../styles/style";
import * as ParagraphStyle from "../styles/paragraph-style";
import {Indexer} from "../abstract-doc";

export interface Paragraph {
  type: "Paragraph",
  styleName: string | undefined,
  paragraphProperties: ParagraphProperties,
  textProperties: TextProperties,
  atoms: Atom[],
  numbering: ParagraphNumbering | undefined,
}

export interface ParagraphProps {
  styleName?: string,
  paragraphProperties?: ParagraphProperties,
  textProperties?: TextProperties,
  atoms?: Atom[],
  numbering?: ParagraphNumbering,
}

export function create({
  styleName = undefined,
  paragraphProperties = {},
  textProperties = {},
  atoms = [],
  numbering = undefined
}: ParagraphProps = {}): Paragraph {
  return {
    type: "Paragraph",
    styleName,
    paragraphProperties,
    textProperties,
    atoms,
    numbering,
  };
}

export function getEffectiveParagraphProperties(styles: Indexer<StyleKey, Style>, p: Paragraph): ParagraphProperties {
  const effectiveStyle = getEffectiveStyle(styles, p);
  return effectiveStyle.paragraphProperties;
}

export function getEffectiveTextProperties(styles: Indexer<StyleKey, Style>, p: Paragraph): TextProperties {
  const effectiveStyle = getEffectiveStyle(styles, p);
  return effectiveStyle.textProperties;
}

function getEffectiveStyle(styles: Indexer<StyleKey, Style>, p: Paragraph): ParagraphStyle.ParagraphStyle {
  const localStyle = ParagraphStyle.create({basedOn: p.styleName, paragraphProperties: p.paragraphProperties, textProperties: p.textProperties});
  const effectiveStyle = getEffectiveStyle2<ParagraphStyle.ParagraphStyle>(styles, localStyle);
  return effectiveStyle;
}

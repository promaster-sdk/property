import * as TextProperties from "../properties/text-properties";
import * as ParagraphProperties from "../properties/paragraph-properties";

export interface ParagraphStyle {
  type: "ParagraphStyle",
  basedOn: string | undefined,
  paragraphProperties: ParagraphProperties.ParagraphProperties,
  textProperties: TextProperties.TextProperties,
}

export function createParagraphStyle(basedOn: string | undefined, paragraphProperties: ParagraphProperties.ParagraphProperties,
                                     textProperties: TextProperties.TextProperties): ParagraphStyle {
  return {
    type: "ParagraphStyle",
    basedOn,
    paragraphProperties,
    textProperties,
  };
}

export function overrideWith(overrider: ParagraphStyle, toOverride: ParagraphStyle): ParagraphStyle {
  return createParagraphStyle(
    undefined,
    ParagraphProperties.overrideWith(overrider.paragraphProperties, toOverride.paragraphProperties),
    TextProperties.overrideWith(overrider.textProperties, toOverride.textProperties));
}

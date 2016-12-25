import * as TextProperties from "../properties/text-properties";
import * as ParagraphProperties from "../properties/paragraph-properties";

export interface ParagraphStyle {
  type: "ParagraphStyle",
  basedOn: string | undefined,
  paragraphProperties: ParagraphProperties.ParagraphProperties,
  textProperties: TextProperties.TextProperties,
}

export interface ParagraphStyleProps {
  basedOn?: string,
  paragraphProperties: ParagraphProperties.ParagraphProperties,
  textProperties: TextProperties.TextProperties,
}

export function create({basedOn, paragraphProperties, textProperties}: ParagraphStyleProps): ParagraphStyle {
  return {
    type: "ParagraphStyle",
    basedOn,
    paragraphProperties,
    textProperties,
  };
}

export function overrideWith(overrider: ParagraphStyle, toOverride: ParagraphStyle): ParagraphStyle {
  return create({
    paragraphProperties: ParagraphProperties.overrideWith(overrider.paragraphProperties, toOverride.paragraphProperties),
    textProperties: TextProperties.overrideWith(overrider.textProperties, toOverride.textProperties)
  });
}

import * as TextProperties from "../properties/text-properties";

export interface TextStyle {
  type: "TextStyle",
  basedOn: string | undefined,
  textProperties: TextProperties.TextProperties,
}

export interface TextStyleProps {
  basedOn?: string,
  textProperties: TextProperties.TextProperties,
}

export function create({basedOn, textProperties}: TextStyleProps): TextStyle {
  return {
    type: "TextStyle",
    basedOn,
    textProperties
  };
}

export function overrideWith(overrider: TextStyle, toOverride: TextStyle): TextStyle {
  return create({
    textProperties: TextProperties.overrideWith(overrider.textProperties, toOverride.textProperties)
  });
}

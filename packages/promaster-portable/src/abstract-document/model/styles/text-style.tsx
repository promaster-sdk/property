import * as TextProperties from "../properties/text-properties";

export interface TextStyle {
  type: "TextStyle",
  basedOn: string | undefined,
  textProperties: TextProperties.TextProperties,
}

export function createTextStyle(basedOn: string | undefined, textProperties: TextProperties.TextProperties): TextStyle {
  return {
    type: "TextStyle",
    basedOn,
    textProperties
  };
}

export function overrideWith(overrider: TextStyle, toOverride: TextStyle): TextStyle {
  return createTextStyle(
    undefined,
    TextProperties.overrideWith(overrider.textProperties, toOverride.textProperties)
  );
}

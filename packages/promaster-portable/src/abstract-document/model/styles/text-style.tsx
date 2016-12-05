import {TextProperties} from "../properties/text-properties";

export interface TextStyle {
  type: "TextStyle",
  basedOn: string | undefined,
  textProperties: TextProperties,
}

export function createTextStyle(basedOn: string | undefined, textProperties: TextProperties): TextStyle {
  return {
    type: "TextStyle",
    basedOn,
    textProperties
  };
}

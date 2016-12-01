import {Style} from "./style";
import {TextProperties} from "../properties/text-properties";

export interface TextStyle extends Style {
  textProperties: TextProperties,
}

export function createTextStyle(basedOn: string | undefined, textProperties: TextProperties): TextStyle {
  return {
    type: "TextStyle",
    basedOn,
    textProperties
  };
}

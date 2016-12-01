import {Style} from "./style";
import {TextProperties} from "../properties/text-properties";

export interface TextStyle extends Style {
  textProperties: TextProperties,
}

export function createTextStyle(basedOn: string, textProperties: TextProperties) {
  return {
    basedOn,
    textProperties
  };
}

import {TextProperties} from "../properties/text-properties";

export interface TextRun {
  type: "TextRun",
  styleName: string,
  text: string,
  textProperties: TextProperties,
}

export function createTextRun(text: string, styleName: string, textProperties: TextProperties): TextRun {
  return {
    type: "TextRun",
    text,
    styleName,
    textProperties,
  }
}

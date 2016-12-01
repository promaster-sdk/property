import {TextProperties} from "../properties/text-properties";

export interface TextRun {
  type: "TextRun",
  styleName: string,
  text: string,
  textProperties: TextProperties,
}

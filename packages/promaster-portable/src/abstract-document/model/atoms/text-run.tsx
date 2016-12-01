import {IAtom} from "./atom";
import {TextProperties} from "../properties/text-properties";

export interface TextRun extends IAtom {
  styleName: string;
  text: string;
  textProperties: TextProperties;
}

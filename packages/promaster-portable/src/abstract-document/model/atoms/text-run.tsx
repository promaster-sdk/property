import {IAtom} from "./atom";
import {TextProperties} from "../properties/types";

export interface TextRun extends IAtom {
  styleName: string;
  text: string;
  textProperties: TextProperties;
}

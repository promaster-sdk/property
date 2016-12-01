import {NumberingFormat} from "./numbering-format";
import {TextProperties} from "../properties/text-properties";

export interface NumberingLevelDefinition {
  format: NumberingFormat;
  level: number;
  levelText: string;
  start: number;
  textProperties: TextProperties;
}

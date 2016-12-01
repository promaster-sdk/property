import {TextProperties} from "../properties/types";
import {NumberingFormat} from "./numbering-format";

export interface Numbering {
  definitionId: string;
}

export interface NumberingDefinition {
  levels: NumberingLevelDefinition[];
}

export interface NumberingLevelDefinition {
  format: NumberingFormat;
  level: number;
  levelText: string;
  start: number;
  textProperties: TextProperties;
}

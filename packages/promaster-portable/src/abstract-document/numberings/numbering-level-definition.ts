import {NumberingFormat} from "./numbering-format";
import {TextProperties} from "../properties/text-properties";
import {AbstractLength} from "../primitives/abstract-length";

export interface NumberingLevelDefinition {
  level: number,
  format: NumberingFormat,
  start: number,
  levelText: string,
  levelIndention: AbstractLength,
  textProperties: TextProperties | undefined,
}

export interface NumberingLevelDefinitionProps {
  level: number,
  format: NumberingFormat,
  start: number,
  levelText: string,
  levelIndention: AbstractLength,
  textProperties?: TextProperties,
}

export function create({level, format, start, levelText, levelIndention, textProperties}:NumberingLevelDefinitionProps): NumberingLevelDefinition {
  return {
    level,
    format,
    start,
    levelText,
    levelIndention,
    textProperties,
  };
}

import {NumberingFormat} from "./numbering-format";

export interface NumberingLevelDefinition {
  level: number,
  format: NumberingFormat,
  start: number,
  levelText: string,
  levelIndention: number,
}

export interface NumberingLevelDefinitionProps {
  level: number,
  format: NumberingFormat,
  start: number,
  levelText: string,
  levelIndention: number,
}

export function create({level, format, start, levelText, levelIndention}:NumberingLevelDefinitionProps): NumberingLevelDefinition {
  return {
    level,
    format,
    start,
    levelText,
    levelIndention,
  };
}

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

export function createNumberingLevelDefinition(level: number, format: NumberingFormat, start: number, levelText: string,
                                               levelIndention: AbstractLength, textProperties: TextProperties | undefined): NumberingLevelDefinition {
  return {
    level,
    format,
    start,
    levelText,
    levelIndention,
    textProperties,
  };
}

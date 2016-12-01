import {NumberingLevelDefinition} from "./numbering-level-definition";

export interface NumberingDefinition {
  levels: NumberingLevelDefinition[],
}

export function createNumberingDefinition(levels: Array<NumberingLevelDefinition>): NumberingDefinition {
  return {
    levels,
  }
}

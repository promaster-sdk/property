import {NumberingLevelDefinition} from "./numbering-level-definition";

export interface NumberingDefinition {
  levels: NumberingLevelDefinition[],
}

export interface NumberingDefinitionProps {
  levels: NumberingLevelDefinition[],
}

export function create({levels}:NumberingDefinitionProps): NumberingDefinition {
  return {
    levels,
  }
}

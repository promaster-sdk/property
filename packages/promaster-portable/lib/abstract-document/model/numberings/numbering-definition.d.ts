import { NumberingLevelDefinition } from "./numbering-level-definition";
export interface NumberingDefinition {
    levels: NumberingLevelDefinition[];
}
export declare function createNumberingDefinition(levels: Array<NumberingLevelDefinition>): NumberingDefinition;

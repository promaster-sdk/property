import { NumberingLevelDefinition } from "../model/numberings/numbering-level-definition";
import { TextProperties } from "../model/properties/text-properties";
import { NumberingFormat } from "../model/numberings/numbering-format";
import { NumberingDefinition } from "../model/numberings/numbering-definition";
import { AbstractLength } from "../model/primitives/abstract-length";
export declare class NumberingDefinitionBuilder {
    readonly levels: Array<NumberingLevelDefinition>;
    addLevel(level: number, format: NumberingFormat, start: number, levelText: string, levelIndention: AbstractLength, textProperties?: TextProperties | undefined): void;
    build(): NumberingDefinition;
}

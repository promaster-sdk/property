import {NumberingLevelDefinition, createNumberingLevelDefinition} from "../model/numberings/numbering-level-definition";
import {TextProperties} from "../model/properties/text-properties";
import {NumberingFormat} from "../model/numberings/numbering-format";
import {NumberingDefinition, createNumberingDefinition} from "../model/numberings/numbering-definition";
import {AbstractLength} from "../model/primitives/abstract-length";

export class NumberingDefinitionBuilder {

  readonly levels: Array<NumberingLevelDefinition> = [];

  addLevel(level: number, format: NumberingFormat, start: number, levelText: string,
           levelIndention: AbstractLength, textProperties: TextProperties | undefined = undefined): void {
    this.levels.push(createNumberingLevelDefinition(level, format, start, levelText, levelIndention, textProperties));
  }

  build(): NumberingDefinition {
    return createNumberingDefinition(this.levels);
  }

}

import {TextAlignment} from "../model/enums/text-alignment";
import {ParagraphProperties, createParagraphProperties} from "../model/properties/paragraph-properties";
import {AbstractLength} from "../model/primitives/abstract-length";

export class ParagraphPropertiesBuilder {

  alignment: TextAlignment | undefined;
  spacingBefore: AbstractLength | undefined;
  spacingAfter: AbstractLength | undefined;

  build(): ParagraphProperties {
    return createParagraphProperties(this.alignment, this.spacingBefore, this.spacingAfter);
  }

}

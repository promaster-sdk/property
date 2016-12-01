import {TextPropertiesBuilder} from "./text-properties-builder";
import {ParagraphStyle, createParagraphStyle} from "../model/styles/paragraph-style";
import {ParagraphPropertiesBuilder} from "./paragraph-properties-builder";

export class ParagraphStyleBuilder {

  basedOn: string;
  readonly paragraphProperties: ParagraphPropertiesBuilder = new ParagraphPropertiesBuilder();
  readonly textProperties: TextPropertiesBuilder = new TextPropertiesBuilder();

  public Build(): ParagraphStyle {
    return createParagraphStyle(this.basedOn, this.paragraphProperties.build(), this.textProperties.build());
  }

}


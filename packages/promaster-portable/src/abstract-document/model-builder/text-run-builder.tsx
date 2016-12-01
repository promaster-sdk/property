import {TextRun, createTextRun} from "../model/atoms/text-run";
import {TextPropertiesBuilder} from "./text-properties-builder";

export class TextRunBuilder {

  text: string;
  styleName: string;
  readonly textProperties: TextPropertiesBuilder = new TextPropertiesBuilder();

  build(): TextRun {
    return createTextRun(this.text, this.styleName, this.textProperties.build());
  }

}

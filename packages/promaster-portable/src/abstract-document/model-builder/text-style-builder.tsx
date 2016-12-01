import {TextPropertiesBuilder} from "./text-properties-builder";
import {TextStyle, createTextStyle} from "../model/styles/text-style";

export class TextStyleBuilder {
  basedOn: string;
  textProperties: TextPropertiesBuilder = new TextPropertiesBuilder();

  build(): TextStyle {
    return createTextStyle(this.basedOn, this.textProperties.build());
  }

}


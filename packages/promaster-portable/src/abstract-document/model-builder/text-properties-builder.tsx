import {TextProperties, createTextProperties} from "../model/properties/text-properties";

export class TextPropertiesBuilder {

  fontFamily: string;
  fontSize: number | undefined;
  underline: boolean | undefined;
  bold: boolean|undefined;
  italic: boolean| undefined;
  color: string;
  subScript: boolean | undefined;
  superScript: boolean | undefined;

  build(): TextProperties {
    return createTextProperties(this.fontFamily, this.fontSize, this.underline, this.bold,
      this.italic, this.color, this.subScript, this.superScript);
  }

}

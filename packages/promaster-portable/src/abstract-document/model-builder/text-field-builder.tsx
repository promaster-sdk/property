import {TextStyleBuilder} from "./text-style-builder";
import {FieldType} from "../model/enums/field-type";
import {TextField, createTextField} from "../model/atoms/text-field";

export class TextFieldBuilder {

  type: FieldType;
  readonly textStyle: TextStyleBuilder = new TextStyleBuilder();

  Build(): TextField {
    return createTextField(this.type, this.textStyle.build());
  }

}

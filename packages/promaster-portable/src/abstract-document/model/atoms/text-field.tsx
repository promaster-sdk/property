import {FieldType} from "../enums/field-type";
import {TextStyle} from "../styles/text-style";

export interface TextField {
  type: "TextField",
  fieldType: FieldType,
  localStyle: TextStyle ;
}

export function createTextField(fieldType: FieldType, localStyle: TextStyle): TextField {
  return {
    type: "TextField",
    fieldType,
    localStyle,
  }
}

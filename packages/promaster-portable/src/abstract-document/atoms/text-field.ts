import {FieldType} from "../enums/field-type";
import {TextStyle} from "../styles/text-style";
import {StyleKey} from "../styles/style-key";
import * as Style from "../styles/style";
import {Indexer} from "../abstract-doc";

export interface TextField {
  type: "TextField",
  fieldType: FieldType,
  localStyle: TextStyle,
}

export interface TextFieldProps {
  fieldType: FieldType,
  localStyle: TextStyle,
}

export function create({fieldType, localStyle}: TextFieldProps): TextField {
  return {
    type: "TextField",
    fieldType,
    localStyle,
  }
}

export function getEffectiveStyle(styles: Indexer<StyleKey, Style.Style>, tf: TextField): TextStyle {
  return Style.getEffectiveStyle2<TextStyle>(styles, tf.localStyle);
}

import { TextStyleBuilder } from "./text-style-builder";
import { FieldType } from "../model/enums/field-type";
import { TextField } from "../model/atoms/text-field";
export declare class TextFieldBuilder {
    type: FieldType;
    readonly textStyle: TextStyleBuilder;
    Build(): TextField;
}

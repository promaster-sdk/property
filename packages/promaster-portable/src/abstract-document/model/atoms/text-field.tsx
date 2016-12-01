import {IAtom} from "./atom";
import {FieldType} from "../enums/field-type";

export interface TextField extends IAtom {
  type: FieldType;
}

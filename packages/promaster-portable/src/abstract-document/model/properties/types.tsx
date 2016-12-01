import {Color, LayoutFoundation} from "../primitives/types";
import {TextAlignment} from "../enums/text-alignment";
import {RowAlignment} from "../enums/row-alignment";
import {TableAlignment} from "../enums/table-alignment";

export interface ParagraphProperties {
  alignment: TextAlignment;
  spacingAfter: any;
  spacingBefore: any;
}

export interface TableCellProperties {
  background: Color;
  borders: LayoutFoundation<number>;
  padding: LayoutFoundation<number>;
  verticalAlignment: RowAlignment;
}

export interface TableProperties {
  alignment: TableAlignment;
}

export interface TextProperties {
  bold: boolean;
  color: string;
  fontFamily: string;
  fontSize: number;
  italic: boolean;
  subScript: boolean;
  superScript: boolean;
  underline: boolean;
}

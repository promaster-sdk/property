import {TextProperties, TableProperties, TableCellProperties, ParagraphProperties} from "../properties/types";
import {LayoutFoundation} from "../primitives/types";
import {PageOrientation} from "../enums/page-orientation";
import {PaperSize} from "../enums/paper-size";

export interface HeaderStyle {
  fixedHeight: number;
  marginBottom: number;
}

export interface PageStyle {
  header: HeaderStyle;
  height: number;
  margins: LayoutFoundation<number>;
  orientation: PageOrientation;
  paperSize: PaperSize;
  width: number;
}

export interface ParagraphStyle extends Style {
  paragraphProperties: ParagraphProperties;
  textProperties: TextProperties;
}

export interface Style {
  basedOn: string;
}

export interface StyleKey {
  name: string;
  type: string;
}

export interface TableCellStyle extends Style {
  tableCellProperties: TableCellProperties;
}

export interface TableStyle extends Style {
  tableProperties: TableProperties;
}

export interface TextStyle extends Style {
  textProperties: TextProperties;
}

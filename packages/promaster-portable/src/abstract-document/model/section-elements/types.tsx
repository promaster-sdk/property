import {TableProperties, ParagraphProperties, TextProperties, TableCellProperties} from "../properties/types";
import {TableRow} from "../table/types";
import {IAtom} from "../atoms/atom";

export interface ISectionElement {
}

export interface KeepTogether {
  sectionElements: ISectionElement[];
}

export interface Paragraph {
  atoms: IAtom[];
  numbering: ParagraphNumbering;
  paragraphProperties: ParagraphProperties;
  styleName: string;
  textProperties: TextProperties;
}

export interface ParagraphNumbering {
  level: number;
  numberingId: string;
}

export interface Table {
  columnWidths: number[];
  nrOfColumns: number;
  nrOfRows: number;
  rows: TableRow[];
  styleName: string;
  tableCellProperties: TableCellProperties;
  tableProperties: TableProperties;
}

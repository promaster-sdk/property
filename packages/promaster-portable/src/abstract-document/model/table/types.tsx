import {ISectionElement} from "../section-elements/i-section-element";
import {TableCellProperties} from "../properties/table-cell-properties";

export interface TableCell {
  columnSpan: number;
  elements: ISectionElement[];
  styleName: string;
  tableCellProperties: TableCellProperties;
}

export interface TableRow {
  cells: TableCell[];
  height: number;
}

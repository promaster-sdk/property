import {TableCellProperties} from "../properties/types";
import {ISectionElement} from "../section-elements/types";

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

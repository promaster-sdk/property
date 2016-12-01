import {TableCellProperties} from "../properties/table-cell-properties";
import {ISectionElement} from "../section-elements/i-section-element";

export interface TableCell {
  columnSpan: number;
  elements: ISectionElement[];
  styleName: string;
  tableCellProperties: TableCellProperties;
}

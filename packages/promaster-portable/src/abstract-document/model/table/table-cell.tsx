import {TableCellProperties} from "../properties/table-cell-properties";
import {SectionElement} from "../section-elements/section-element";

export interface TableCell {
  columnSpan: number,
  elements: SectionElement[],
  styleName: string,
  tableCellProperties: TableCellProperties,
}

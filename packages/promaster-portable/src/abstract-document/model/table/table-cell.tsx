import {TableCellProperties} from "../properties/table-cell-properties";
import {SectionElement} from "../section-elements/section-element";

export interface TableCell {
  columnSpan: number,
  elements: SectionElement[],
  styleName: string,
  tableCellProperties: TableCellProperties,
}

export function createTableCell(styleName: string, tableCellProperties: TableCellProperties,
                                columnSpan: number, elements: Array<SectionElement>): TableCell {
  return {
    styleName,
    tableCellProperties,
    columnSpan,
    elements,
  }
}

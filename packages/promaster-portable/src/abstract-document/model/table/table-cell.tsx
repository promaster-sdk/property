import {TableCellProperties} from "../properties/table-cell-properties";
import {SectionElement} from "../section-elements/section-element";

export interface TableCell {
  styleName: string | undefined,
  columnSpan: number,
  elements: SectionElement[],
  tableCellProperties: TableCellProperties,
}

export function createTableCell(styleName: string | undefined, tableCellProperties: TableCellProperties,
                                columnSpan: number, elements: Array<SectionElement>): TableCell {
  return {
    styleName,
    tableCellProperties,
    columnSpan,
    elements,
  }
}

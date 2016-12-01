import {TableCellProperties} from "../properties/table-cell-properties";
import {TableProperties} from "../properties/table-properties";
import {TableRow} from "../table/table-row";

export interface Table {
  columnWidths: number[],
  rows: TableRow[],
  styleName: string,
  tableCellProperties: TableCellProperties,
  tableProperties: TableProperties,
}


export function createTable(styleName: string, tableProperties: TableProperties, tableCellProperties: TableCellProperties,
                            columnWidths: number[], rows: Array<TableRow>): Table {
  return {
    styleName,
    tableProperties,
    tableCellProperties,
    columnWidths,
    rows,
  }
}

export function nrOfRows(table: Table): number {
  return table.rows.length;
}

export function nrOfColumns(table: Table): number {
  // return table.rows.Any() ? table.rows.first().Cells.Sum(c => c.ColumnSpan) : 0;
  throw new Error(`TODO: ${table}`);
}

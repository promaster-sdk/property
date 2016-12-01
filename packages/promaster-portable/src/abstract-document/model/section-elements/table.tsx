import {TableCellProperties} from "../properties/table-cell-properties";
import {TableProperties} from "../properties/table-properties";
import {TableRow} from "../table/table-row";

export interface Table {
  columnWidths: number[],
  nrOfColumns: number,
  nrOfRows: number,
  rows: TableRow[],
  styleName: string,
  tableCellProperties: TableCellProperties,
  tableProperties: TableProperties,
}

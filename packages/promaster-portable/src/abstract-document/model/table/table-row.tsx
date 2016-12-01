import {TableCell} from "./table-cell";

export interface TableRow {
  cells: TableCell[],
  height: number,
}

export function createTableRow(height: number, cells: Array<TableCell>) {
  return {
    height,
    cells,
  };
}

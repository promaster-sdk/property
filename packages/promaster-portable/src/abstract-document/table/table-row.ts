import {TableCell} from "./table-cell";

export interface TableRow {
  cells: TableCell[],
  height: number,
}

export interface TableRowProps {
  cells: TableCell[],
  height?: number,
}

export function create({height = Infinity, cells}: TableRowProps) {
  return {
    height,
    cells,
  };
}

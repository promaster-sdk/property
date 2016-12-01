import { TableCell } from "./table-cell";
export interface TableRow {
    cells: TableCell[];
    height: number;
}
export declare function createTableRow(height: number, cells: Array<TableCell>): {
    height: number;
    cells: TableCell[];
};

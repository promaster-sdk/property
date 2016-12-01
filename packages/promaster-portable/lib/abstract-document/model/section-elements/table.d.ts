import { TableCellProperties } from "../properties/table-cell-properties";
import { TableProperties } from "../properties/table-properties";
import { TableRow } from "../table/table-row";
export interface Table {
    columnWidths: number[];
    rows: TableRow[];
    styleName: string;
    tableCellProperties: TableCellProperties;
    tableProperties: TableProperties;
}
export declare function createTable(styleName: string, tableProperties: TableProperties, tableCellProperties: TableCellProperties, columnWidths: number[], rows: Array<TableRow>): Table;
export declare function nrOfRows(table: Table): number;
export declare function nrOfColumns(table: Table): number;

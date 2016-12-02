import { TableCellProperties } from "../properties/table-cell-properties";
import { Style } from "./style";
export interface TableCellStyle extends Style {
    tableCellProperties: TableCellProperties;
}
export declare function createTableCellStyle(basedOn: string | undefined, tableCellProperties: TableCellProperties): TableCellStyle;

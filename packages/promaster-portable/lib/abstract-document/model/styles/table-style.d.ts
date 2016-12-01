import { TableProperties } from "../properties/table-properties";
import { Style } from "./style";
export interface TableStyle extends Style {
    tableProperties: TableProperties;
}
export declare function createTableStyle(basedOn: string, tableProperties: TableProperties): TableStyle;

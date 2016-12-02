import { TableAlignment } from "../enums/table-alignment";
export interface TableProperties {
    alignment: TableAlignment | undefined;
}
export declare function createTableProperties(alignment: TableAlignment | undefined): TableProperties;

import { TableStyle } from "../model/styles/table-style";
import { TableProperties } from "../model/properties/table-properties";
export declare class TableStyleBuilder {
    basedOn: string;
    tableProperties: TableProperties;
    Build(): TableStyle;
}

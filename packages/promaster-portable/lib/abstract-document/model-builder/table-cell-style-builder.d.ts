import { TableCellStyle } from "../model/styles/table-cell-style";
import { TableCellPropertiesBuilder } from "./table-cell-properties-builder";
export declare class TableCellStyleBuilder {
    basedOn: string;
    readonly tableCellProperties: TableCellPropertiesBuilder;
    build(): TableCellStyle;
}

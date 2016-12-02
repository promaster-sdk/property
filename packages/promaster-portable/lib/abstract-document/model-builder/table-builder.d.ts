import { TablePropertiesBuilder } from "./table-properties-builder";
import { TableCellPropertiesBuilder } from "./table-cell-properties-builder";
import { Table } from "../model/section-elements/table";
import { TableRow } from "../model/table/table-row";
import { IBuilder } from "./i-builder";
export declare class TableBuilder implements IBuilder<TableRow> {
    builderType: "TableBuilder";
    builtType: "TableRow";
    columns: number[];
    keepTogether: boolean;
    styleName: string;
    readonly tableProperties: TablePropertiesBuilder;
    readonly tableCellProperties: TableCellPropertiesBuilder;
    private readonly list;
    add(child: TableRow): void;
    build(): Table;
}

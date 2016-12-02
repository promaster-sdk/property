import { TableRow } from "../model/table/table-row";
import { TableCell } from "../model/table/table-cell";
import { IBuilder } from "./i-builder";
export declare class TableRowBuilder implements IBuilder<TableCell> {
    builderType: "TableRowBuilder";
    builtType: "TableCell";
    height: number;
    private readonly list;
    constructor(height: number);
    add(child: TableCell): void;
    build(): TableRow;
}

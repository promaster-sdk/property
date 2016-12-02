import { TableCell } from "../model/table/table-cell";
import { TableCellPropertiesBuilder } from "./table-cell-properties-builder";
import { SectionElement } from "../model/section-elements/section-element";
import { IBuilder } from "./i-builder";
export declare class TableCellBuilder implements IBuilder<SectionElement> {
    builderType: "TableCellBuilder";
    builtType: "SectionElement";
    styleName: string;
    columnSpan: number;
    readonly tableCellProperties: TableCellPropertiesBuilder;
    private readonly list;
    add(child: SectionElement): void;
    build(): TableCell;
}

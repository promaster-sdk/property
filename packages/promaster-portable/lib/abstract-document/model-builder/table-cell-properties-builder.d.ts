import { TableCellProperties } from "../model/properties/table-cell-properties";
import { LayoutFoundation } from "../model/primitives/layout-foundation";
import { RowAlignment } from "../model/enums/row-alignment";
import { Color } from "../../abstract-image/color";
export declare class TableCellPropertiesBuilder {
    borders: LayoutFoundation<number | undefined>;
    padding: LayoutFoundation<number | undefined>;
    verticalAlignment: RowAlignment | undefined;
    background: Color | undefined;
    setBorderThickness(thickness: number | undefined): void;
    build(): TableCellProperties;
}

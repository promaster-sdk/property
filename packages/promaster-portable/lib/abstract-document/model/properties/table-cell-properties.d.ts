import { RowAlignment } from "../enums/row-alignment";
import { Color } from "../../../abstract-image/color";
import { LayoutFoundation } from "../primitives/layout-foundation";
export interface TableCellProperties {
    background: Color | undefined;
    borders: LayoutFoundation<number | undefined>;
    padding: LayoutFoundation<number | undefined>;
    verticalAlignment: RowAlignment | undefined;
}
export declare function createTableCellProperties(borders: LayoutFoundation<number | undefined>, padding: LayoutFoundation<number | undefined>, verticalAlignment: RowAlignment | undefined, background: Color | undefined): TableCellProperties;

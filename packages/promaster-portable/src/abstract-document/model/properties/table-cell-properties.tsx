import {RowAlignment} from "../enums/row-alignment";
import {Color} from "../../../abstract-image/color";
import {LayoutFoundation} from "../primitives/layout-foundation";

export interface TableCellProperties {
  background: Color,
  borders: LayoutFoundation<number>,
  padding: LayoutFoundation<number>,
  verticalAlignment: RowAlignment,
}

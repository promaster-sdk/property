import {TableCellProperties, createTableCellProperties} from "../model/properties/table-cell-properties";
import {LayoutFoundation, createLayoutFoundation} from "../model/primitives/layout-foundation";
import {RowAlignment} from "../model/enums/row-alignment";
import {Color} from "../../abstract-image/color";

export class TableCellPropertiesBuilder {
  borders: LayoutFoundation<number|undefined> = createLayoutFoundation<number|undefined>(undefined, undefined, undefined, undefined);
  padding: LayoutFoundation<number|undefined> = createLayoutFoundation<number|undefined>(undefined, undefined, undefined, undefined);
  verticalAlignment: RowAlignment |undefined;
  background: Color|undefined;

  setBorderThickness(thickness: number |undefined): void {
    this.borders.left = thickness;
    this.borders.top = thickness;
    this.borders.right = thickness;
    this.borders.bottom = thickness;
  }

  build(): TableCellProperties {
    return createTableCellProperties(this.borders, this.padding, this.verticalAlignment, this.background);
  }

}


import {TableCellStyle, createTableCellStyle} from "../model/styles/table-cell-style";
import {TableCellPropertiesBuilder} from "./table-cell-properties-builder";

export class TableCellStyleBuilder {
  basedOn: string;
  readonly tableCellProperties: TableCellPropertiesBuilder = new TableCellPropertiesBuilder();

  build(): TableCellStyle {
    return createTableCellStyle(this.basedOn, this.tableCellProperties.build());
  }

}

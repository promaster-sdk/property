import {TableStyle, createTableStyle} from "../model/styles/table-style";
import {TableProperties} from "../model/properties/table-properties";

export class TableStyleBuilder {

  basedOn: string;
  tableProperties: TableProperties;

  Build(): TableStyle {
    return createTableStyle(this.basedOn, this.tableProperties);
  }

}

import {TableProperties} from "../properties/table-properties";
import {Style} from "./style";

export interface TableStyle extends Style {
  type: "TableStyle",
  tableProperties: TableProperties,
}

export function createTableStyle(basedOn: string | undefined, tableProperties: TableProperties): TableStyle {
  return {
    type: "TableStyle",
    basedOn,
    tableProperties,
  }
}


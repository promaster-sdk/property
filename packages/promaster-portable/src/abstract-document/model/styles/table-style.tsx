import {TableProperties} from "../properties/table-properties";
import {Style} from "./style";

export interface TableStyle extends Style {
  tableProperties: TableProperties,
}

export function createTableStyle(basedOn: string, tableProperties: TableProperties): TableStyle {
  return {
    basedOn,
    tableProperties,
  }
}


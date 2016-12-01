import {TableCellProperties} from "../properties/table-cell-properties";
import {Style} from "./style";

export interface TableCellStyle extends Style {
  tableCellProperties: TableCellProperties,
}

export function createTableCellStyle(basedOn: string, tableCellProperties: TableCellProperties): TableCellStyle {
  return {
    basedOn,
    tableCellProperties,
  };
}

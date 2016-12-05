import {TableCellProperties} from "../properties/table-cell-properties";

export interface TableCellStyle {
  type: "TableCellStyle",
  basedOn: string | undefined,
  tableCellProperties: TableCellProperties,
}

export function createTableCellStyle(basedOn: string | undefined, tableCellProperties: TableCellProperties): TableCellStyle {
  return {
    type: "TableCellStyle",
    basedOn,
    tableCellProperties,
  };
}

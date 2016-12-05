import {TableProperties} from "../properties/table-properties";

export interface TableStyle {
  type: "TableStyle",
  basedOn: string | undefined,
  tableProperties: TableProperties,
}

export function createTableStyle(basedOn: string | undefined, tableProperties: TableProperties): TableStyle {
  return {
    type: "TableStyle",
    basedOn,
    tableProperties,
  }
}


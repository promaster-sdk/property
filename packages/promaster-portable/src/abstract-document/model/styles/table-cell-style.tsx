import * as TableCellProperties from "../properties/table-cell-properties";

export interface TableCellStyle {
  type: "TableCellStyle",
  basedOn: string | undefined,
  tableCellProperties: TableCellProperties.TableCellProperties,
}

export function createTableCellStyle(basedOn: string | undefined, tableCellProperties: TableCellProperties.TableCellProperties): TableCellStyle {
  return {
    type: "TableCellStyle",
    basedOn,
    tableCellProperties,
  };
}

export function overrideWith(overrider: TableCellStyle, toOverride: TableCellStyle): TableCellStyle {
  return createTableCellStyle(
    undefined,
    TableCellProperties.overrideWith(overrider.tableCellProperties, toOverride.tableCellProperties)
  );
}


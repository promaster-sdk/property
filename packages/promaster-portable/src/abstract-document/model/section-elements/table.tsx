import {TableCellProperties} from "../properties/table-cell-properties";
import {TableProperties} from "../properties/table-properties";
import {TableRow} from "../table/table-row";
import {Indexer} from "../abstract-doc";
import {TableStyle, createTableStyle} from "../styles/table-style";
import * as Style from "../styles/style";
import {StyleKey} from "../styles/style-key";

export interface Table {
  type: "Table",
  columnWidths: number[],
  rows: TableRow[],
  styleName: string,
  tableCellProperties: TableCellProperties,
  tableProperties: TableProperties,
}


export function createTable(styleName: string, tableProperties: TableProperties, tableCellProperties: TableCellProperties,
                            columnWidths: number[], rows: Array<TableRow>): Table {
  return {
    type: "Table",
    styleName,
    tableProperties,
    tableCellProperties,
    columnWidths,
    rows,
  }
}

export function nrOfRows(table: Table): number {
  return table.rows.length;
}

export function nrOfColumns(table: Table): number {
  // return table.rows.Any() ? table.rows.first().Cells.Sum(c => c.ColumnSpan) : 0;
  throw new Error(`TODO: ${table}`);
}

export function getEffectiveTableProperties(styles: Indexer<StyleKey, Style.Style>, table: Table): TableProperties {
  const effectiveStyle = GetEffectiveStyle(styles, table);
  return effectiveStyle.tableProperties;
}

function GetEffectiveStyle(styles: Indexer<StyleKey, Style.Style>, table: Table): TableStyle {
  const localStyle = createTableStyle(table.styleName, table.tableProperties);
  const effectiveStyle = Style.getEffectiveStyle2<TableStyle>(styles, localStyle);
  return effectiveStyle;
}

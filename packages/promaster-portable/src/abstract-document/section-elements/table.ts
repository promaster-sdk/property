import * as TableCellProperties from "../properties/table-cell-properties";
import * as TableProperties from "../properties/table-properties";
import * as TableRow from "../table/table-row";
import * as TableStyle from "../styles/table-style";
import * as Style from "../styles/style";
import {StyleKey} from "../styles/style-key";
import {Indexer} from "../abstract-doc";

export interface Table {
  type: "Table",
  columnWidths: number[],
  rows: TableRow.TableRow[],
  styleName: string | undefined,
  tableCellProperties: TableCellProperties.TableCellProperties,
  tableProperties: TableProperties.TableProperties,
}

export interface TableProps {
  columnWidths: number[],
  rows: TableRow.TableRow[],
  styleName?: string,
  tableCellProperties?: TableCellProperties.TableCellProperties,
  tableProperties?: TableProperties.TableProperties,
}


export function create({
  styleName = undefined,
  tableProperties = {},
  tableCellProperties = TableCellProperties.create(),
  columnWidths,
  rows
}: TableProps): Table {
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

export function getEffectiveTableProperties(styles: Indexer<StyleKey, Style.Style>, table: Table): TableProperties.TableProperties {
  const effectiveStyle = GetEffectiveStyle(styles, table);
  return effectiveStyle.tableProperties;
}

function GetEffectiveStyle(styles: Indexer<StyleKey, Style.Style>, table: Table): TableStyle.TableStyle {
  const localStyle = TableStyle.create({basedOn: table.styleName, tableProperties: table.tableProperties});
  const effectiveStyle = Style.getEffectiveStyle2<TableStyle.TableStyle>(styles, localStyle);
  return effectiveStyle;
}

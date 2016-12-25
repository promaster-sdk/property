import * as TableCellProperties from "../properties/table-cell-properties";

export interface TableCellStyle {
  type: "TableCellStyle",
  basedOn: string | undefined,
  tableCellProperties: TableCellProperties.TableCellProperties,
}

export interface TableCellStyleProps {
  basedOn?: string,
  tableCellProperties: TableCellProperties.TableCellProperties,
}

export function create({basedOn, tableCellProperties}: TableCellStyleProps): TableCellStyle {
  return {
    type: "TableCellStyle",
    basedOn,
    tableCellProperties,
  };
}

export function overrideWith(overrider: TableCellStyle, toOverride: TableCellStyle): TableCellStyle {
  return create({
    tableCellProperties: TableCellProperties.overrideWith(overrider.tableCellProperties, toOverride.tableCellProperties)
  });
}


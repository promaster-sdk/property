import * as TableProperties from "../properties/table-properties";

export interface TableStyle {
  type: "TableStyle",
  basedOn: string | undefined,
  tableProperties: TableProperties.TableProperties,
}

export interface TableStyleProps {
  basedOn?: string,
  tableProperties: TableProperties.TableProperties,
}

export function create({basedOn, tableProperties}: TableStyleProps): TableStyle {
  return {
    type: "TableStyle",
    basedOn,
    tableProperties,
  }
}

export function overrideWith(overrider: TableStyle, toOverride: TableStyle): TableStyle {
  return create({
    tableProperties: TableProperties.overrideWith(overrider.tableProperties, toOverride.tableProperties)
  });
}

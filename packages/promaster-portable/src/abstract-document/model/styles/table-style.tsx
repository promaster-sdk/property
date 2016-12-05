import * as TableProperties from "../properties/table-properties";

export interface TableStyle {
  type: "TableStyle",
  basedOn: string | undefined,
  tableProperties: TableProperties.TableProperties,
}

export function createTableStyle(basedOn: string | undefined, tableProperties: TableProperties.TableProperties): TableStyle {
  return {
    type: "TableStyle",
    basedOn,
    tableProperties,
  }
}

export function overrideWith(overrider: TableStyle, toOverride: TableStyle): TableStyle {
  return createTableStyle(
    undefined,
    TableProperties.overrideWith(overrider.tableProperties, toOverride.tableProperties)
  );
}


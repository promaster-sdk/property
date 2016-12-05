import {TableAlignment} from "../enums/table-alignment";

export interface TableProperties {
  alignment: TableAlignment | undefined,
}

export function createTableProperties(alignment: TableAlignment | undefined): TableProperties {
  return {
    alignment,
  };
}

export function overrideWith(overrider: TableProperties, toOverride: TableProperties): TableProperties {
  if (!overrider)
    return toOverride;
  return createTableProperties(
    overrider.alignment || toOverride.alignment
  );
}

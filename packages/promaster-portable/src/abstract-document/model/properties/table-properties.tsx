import {TableAlignment} from "../enums/table-alignment";

export interface TableProperties {
  alignment: TableAlignment | undefined,
}

export function createTableProperties(alignment: TableAlignment | undefined): TableProperties {
  return {
    alignment,
  };
}


import {TableAlignment} from "../enums/table-alignment";

export interface TableProperties {
  alignment?: TableAlignment,
}

export interface TablePropertiesProps {
  alignment?: TableAlignment,
}

export function create({alignment}:TablePropertiesProps): TableProperties {
  return {
    alignment,
  };
}

export function overrideWith(overrider: TableProperties, toOverride: TableProperties): TableProperties {
  if (!overrider)
    return toOverride;
  return create({
    alignment: overrider.alignment || toOverride.alignment
  });
}

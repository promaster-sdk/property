import {RowAlignment} from "../enums/row-alignment";
import {Color} from "../../../abstract-image/color";
import {LayoutFoundation, createLayoutFoundation} from "../primitives/layout-foundation";

export interface TableCellProperties {
  background: Color | undefined,
  borders: LayoutFoundation<number| undefined>,
  padding: LayoutFoundation<number| undefined>,
  verticalAlignment: RowAlignment | undefined,
}

export function createTableCellProperties(borders: LayoutFoundation<number | undefined>, padding: LayoutFoundation<number | undefined>,
                                          verticalAlignment: RowAlignment|undefined, background: Color|undefined): TableCellProperties {
  return {
    borders,
    padding,
    verticalAlignment,
    background,
  }
}

export function overrideWith(overrider: TableCellProperties, toBeOverridden: TableCellProperties): TableCellProperties {
  if (overrider == null)
    return toBeOverridden;
  return createTableCellProperties(
    createLayoutFoundation<number | undefined>(
      overrider.borders.top || toBeOverridden.borders.top,
      overrider.borders.bottom || toBeOverridden.borders.bottom,
      overrider.borders.left || toBeOverridden.borders.left,
      overrider.borders.right || toBeOverridden.borders.right
    ),
    createLayoutFoundation<number | undefined>(
      overrider.padding.top || toBeOverridden.padding.top,
      overrider.padding.bottom || toBeOverridden.padding.bottom,
      overrider.padding.left || toBeOverridden.padding.left,
      overrider.padding.right || toBeOverridden.padding.right
    ),
    overrider.verticalAlignment || toBeOverridden.verticalAlignment,
    overrider.background || toBeOverridden.background
  );
}

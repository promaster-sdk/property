import {RowAlignment} from "../enums/row-alignment";
import {Color} from "../../abstract-image/color";
import * as LayoutFoundation from "../primitives/layout-foundation";

export interface TableCellProperties {
  background?: Color,
  borders: LayoutFoundation.LayoutFoundation<number| undefined>,
  padding: LayoutFoundation.LayoutFoundation<number| undefined>,
  verticalAlignment?: RowAlignment,
}

export interface TableCellPropertiesProps {
  background?: Color,
  borders?: LayoutFoundation.LayoutFoundation<number| undefined>,
  padding?: LayoutFoundation.LayoutFoundation<number| undefined>,
  verticalAlignment?: RowAlignment,
}

export function create({
  borders = LayoutFoundation.create({top:undefined, bottom: undefined, left: undefined, right: undefined}),
  padding = LayoutFoundation.create({top:undefined, bottom: undefined, left: undefined, right: undefined}),
  verticalAlignment, background}: TableCellPropertiesProps = {}): TableCellProperties {
  return {
    borders,
    padding,
    verticalAlignment,
    background,
  }
}

export function overrideWith(overrider: TableCellProperties, toBeOverridden: TableCellProperties): TableCellProperties {
  if (!overrider)
    return toBeOverridden;
  return create({
    borders: LayoutFoundation.create<number | undefined>({
      top: overrider.borders.top || toBeOverridden.borders.top,
      bottom: overrider.borders.bottom || toBeOverridden.borders.bottom,
      left: overrider.borders.left || toBeOverridden.borders.left,
      right: overrider.borders.right || toBeOverridden.borders.right
    }),
    padding: LayoutFoundation.create<number | undefined>({
      top: overrider.padding.top || toBeOverridden.padding.top,
      bottom: overrider.padding.bottom || toBeOverridden.padding.bottom,
      left: overrider.padding.left || toBeOverridden.padding.left,
      right: overrider.padding.right || toBeOverridden.padding.right
    }),
    verticalAlignment: overrider.verticalAlignment || toBeOverridden.verticalAlignment,
    background: overrider.background || toBeOverridden.background
  });
}

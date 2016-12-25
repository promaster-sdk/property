import * as LayoutFoundation from "../primitives/layout-foundation";

export interface HeaderStyle {
  fixedHeight: number | undefined,
  margins: LayoutFoundation.LayoutFoundation<number>,
}

export interface HeaderStyleProps {
  fixedHeight?: number,
  marginBottom: number,
}

export function create({fixedHeight, marginBottom}: HeaderStyleProps): HeaderStyle {
  const margins = LayoutFoundation.create<number>({top: 0.0, bottom: marginBottom, left: 0.0, right: 0.0});
  return {
    fixedHeight,
    margins
  };
}

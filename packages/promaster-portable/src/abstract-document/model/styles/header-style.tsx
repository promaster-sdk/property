import {LayoutFoundation, createLayoutFoundation} from "../primitives/layout-foundation";

export interface HeaderStyle {
  fixedHeight: number | undefined,
  margins: LayoutFoundation<number>,
}

export function createHeaderStyle(fixedHeight: number | undefined, marginBottom: number): HeaderStyle {
  const margins = createLayoutFoundation<number>(0.0, marginBottom, 0.0, 0.0);
  return {
    fixedHeight,
    margins
  };
}

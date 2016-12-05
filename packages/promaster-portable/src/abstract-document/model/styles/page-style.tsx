import {PaperSize} from "../enums/paper-size";
import {HeaderStyle} from "./header-style";
import {LayoutFoundation, createLayoutFoundation} from "../primitives/layout-foundation";
import {PageOrientation} from "../enums/page-orientation";

export interface PageStyle {
  header: HeaderStyle,
  margins: LayoutFoundation<number>,
  orientation: PageOrientation,
  paperSize: PaperSize,
}

export function createPageStyle(paperSize: PaperSize, orientation: PageOrientation, header: HeaderStyle): PageStyle {
  return {
    header,
    paperSize,
    orientation,
    margins: createLayoutFoundation<number>(8.0 * 595.0 / 210.0, 8.0 * 595.0 / 210.0, 20.0 * 595.0 / 210.0, 15.0 * 595.0 / 210.0)
  };
}

export function getWidth(pageStyle: PageStyle): number {
  return pageStyle.orientation === "Landscape" ? getPageHeight(pageStyle.paperSize) : getPageWidth(pageStyle.paperSize);
}

export function getHeight(pageStyle: PageStyle): number {
  return pageStyle.orientation === "Landscape" ? getPageWidth(pageStyle.paperSize) : getPageHeight(pageStyle.paperSize);
}

export function getPageWidth(ps: PaperSize): number {
  switch (ps) {
    case "A4":
      return 595;
    case "Letter":
      return 612;
    default:
      throw new Error("Unknown paper size");
  }
}

export function getPageHeight(ps: PaperSize): number {
  switch (ps) {
    case "A4":
      return 842;
    case "Letter":
      return 792;
    default:
      throw new Error("Unknown paper size");
  }
}

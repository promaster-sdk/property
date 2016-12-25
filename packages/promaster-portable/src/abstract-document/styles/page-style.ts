import {PaperSize} from "../enums/paper-size";
import {HeaderStyle} from "./header-style";
import * as LayoutFoundation from "../primitives/layout-foundation";
import {PageOrientation} from "../enums/page-orientation";

export interface PageStyle {
  header: HeaderStyle,
  margins: LayoutFoundation.LayoutFoundation<number>,
  orientation: PageOrientation,
  paperSize: PaperSize,
}

export interface PageStyleProps {
  header: HeaderStyle,
  orientation: PageOrientation,
  paperSize: PaperSize,
}

export function create({paperSize, orientation, header}: PageStyleProps): PageStyle {
  return {
    header,
    paperSize,
    orientation,
    margins: LayoutFoundation.create<number>({top: 8.0 * 595.0 / 210.0, bottom: 8.0 * 595.0 / 210.0, left: 20.0 * 595.0 / 210.0, right: 15.0 * 595.0 / 210.0})
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

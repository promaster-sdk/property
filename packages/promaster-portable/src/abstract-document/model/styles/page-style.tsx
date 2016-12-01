import {PaperSize} from "../enums/paper-size";
import {HeaderStyle} from "./header-style";
import {LayoutFoundation} from "../primitives/layout-foundation";
import {PageOrientation} from "../enums/page-orientation";

export interface PageStyle {
  header: HeaderStyle,
  height: number,
  margins: LayoutFoundation<number>,
  orientation: PageOrientation,
  paperSize: PaperSize,
  width: number,
}

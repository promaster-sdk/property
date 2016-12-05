import {SectionElement} from "../section-elements/section-element";
import * as PageStyle from "../styles/page-style";

export interface MasterPage {
  style: PageStyle.PageStyle,
  header: SectionElement[],
  footer: SectionElement[],
}

export function createMasterPage(style: PageStyle.PageStyle, header: Array<SectionElement>): MasterPage {
  return {
    style,
    header,
    footer: []
  };
}

export function getPrintableWidth(page: MasterPage): number {
  return PageStyle.getWidth(page.style) - page.style.margins.left - page.style.margins.right;
}

export function getPrintableHeight(page: MasterPage): number {
  const headerHeight = page.style.header.fixedHeight ? page.style.header.fixedHeight : 0;
  return PageStyle.getHeight(page.style) - page.style.margins.top - page.style.margins.bottom - headerHeight - page.style.header.margins.bottom;
}

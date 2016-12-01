import {ISectionElement} from "../section-elements/i-section-element";
import {PageStyle} from "../styles/page-style";

export interface MasterPage {
  footer: ISectionElement[];
  header: ISectionElement[];
  printableHeight: number;
  printableWidth: number;
  style: PageStyle;
}

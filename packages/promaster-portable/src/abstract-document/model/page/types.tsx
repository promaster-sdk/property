import {ISectionElement} from "../section-elements/types";
import {PageStyle} from "../styles/types";

export interface MasterPage {
  footer: ISectionElement[];
  header: ISectionElement[];
  printableHeight: number;
  printableWidth: number;
  style: PageStyle;
}

export interface Section {
  page: MasterPage;
  sectionElements: ISectionElement[];
}

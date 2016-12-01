import {MasterPage} from "./master-page";
import {ISectionElement} from "../section-elements/i-section-element";

export interface Section {
  page: MasterPage;
  sectionElements: ISectionElement[];
}

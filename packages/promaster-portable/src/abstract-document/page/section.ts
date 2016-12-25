import {MasterPage} from "./master-page";
import {SectionElement} from "../section-elements/section-element";

export interface Section {
  page: MasterPage,
  sectionElements: SectionElement[],
}

export interface SectionProps {
  page: MasterPage,
  sectionElements: SectionElement[],
}

export function create({page, sectionElements}:SectionProps): Section {
  return {
    page,
    sectionElements,
  };
}

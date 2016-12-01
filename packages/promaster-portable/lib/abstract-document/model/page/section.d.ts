import { MasterPage } from "./master-page";
import { SectionElement } from "../section-elements/section-element";
export interface Section {
    page: MasterPage;
    sectionElements: SectionElement[];
}

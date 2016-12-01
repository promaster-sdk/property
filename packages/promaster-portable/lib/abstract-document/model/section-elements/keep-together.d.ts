import { SectionElement } from "./section-element";
export interface KeepTogether {
    type: "KeepTogether";
    sectionElements: SectionElement[];
}
export declare function createKeepTogether(sectionElements: Array<SectionElement>): KeepTogether;

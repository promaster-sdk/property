import {SectionElement} from "./section-element";

export interface KeepTogether {
  type: "KeepTogether",
  sectionElements: SectionElement[],
}

export function createKeepTogether(sectionElements: Array<SectionElement>): KeepTogether {
  return {
    type: "KeepTogether",
    sectionElements,
  };
}

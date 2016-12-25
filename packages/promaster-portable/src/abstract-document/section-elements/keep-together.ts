import {SectionElement} from "./section-element";

export interface KeepTogether {
  type: "KeepTogether",
  sectionElements: SectionElement[],
}

export interface KeepTogetherProps {
  sectionElements: SectionElement[],
}

export function create({sectionElements}:KeepTogetherProps): KeepTogether {
  return {
    type: "KeepTogether",
    sectionElements,
  };
}

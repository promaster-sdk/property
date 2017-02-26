import {SectionElement} from "./section-element";

export interface KeepTogether {
  readonly type: "KeepTogether",
  readonly children: SectionElement[],
}

export interface KeepTogetherProps {
  readonly children?: SectionElement[],
}

export function create(props?: KeepTogetherProps): KeepTogether {
  const {
    children = []
  } = props || {};
  return {
    type: "KeepTogether",
    children: children
  };
}

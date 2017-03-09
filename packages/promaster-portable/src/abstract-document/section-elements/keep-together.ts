import {Resources} from "../resources";
import {SectionElement} from "./section-element";

export type KeepTogether = Resources & {
  readonly type: "KeepTogether",
  readonly children: SectionElement[],
}

export type KeepTogetherProps = Resources & {
  readonly children?: SectionElement[],
}

export function create(props?: KeepTogetherProps): KeepTogether {
  const {
    children = [],
    ...rest
  } = props || {};
  return {
    type: "KeepTogether",
    children: children,
    ...rest
  };
}

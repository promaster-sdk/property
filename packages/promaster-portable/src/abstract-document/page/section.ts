import * as MasterPage from "./master-page";
import {SectionElement} from "../section-elements/section-element";

export interface Section {
  readonly page: MasterPage.MasterPage,
  readonly children: SectionElement[],
}

export interface SectionProps {
  readonly page?: MasterPage.MasterPage,
  readonly children?: SectionElement[],
}

export function create(props?: SectionProps): Section {
  const {
    page = MasterPage.create(),
    children = []
  } = props || {};
  return {
    page,
    children
  };
}

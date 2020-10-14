import { TranslatePropertyLabelHover } from "./types";

export type PropertyLabelComponentProps = {
  readonly selectorIsValid: boolean;
  readonly selectorIsHidden: boolean;
  readonly selectorLabel: string;
  readonly translatePropertyLabelHover: TranslatePropertyLabelHover;
  readonly propertyName: string;
};

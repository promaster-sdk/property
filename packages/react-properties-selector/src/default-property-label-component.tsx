import * as React from "react";
import { TranslatePropertyLabelHover } from "./types";

export interface PropertyLabelComponentProps {
  readonly selectorIsValid: boolean;
  readonly selectorIsHidden: boolean;
  readonly selectorLabel: string;
  readonly translatePropertyLabelHover: TranslatePropertyLabelHover;
  readonly propertyName: string;
}

export function DefaultPropertyLabelComponent({
  selectorIsValid,
  selectorIsHidden,
  selectorLabel,
  translatePropertyLabelHover,
  propertyName
}: PropertyLabelComponentProps): React.ReactElement<
  PropertyLabelComponentProps
> {
  return (
    <label
      className={!selectorIsValid ? "invalid" : undefined}
      title={translatePropertyLabelHover(propertyName)}
    >
      <span className={selectorIsHidden ? "hidden-property" : ""}>
        {selectorLabel}
      </span>
    </label>
  );
}

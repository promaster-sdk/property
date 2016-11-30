import * as React from "react";
import {TranslatePropertyLabelHover} from "./types";

export interface PropertyLabelComponentProps {selectorIsValid: boolean,
  selectorIsHidden: boolean,
  selectorLabel: string,
  translatePropertyLabelHover: TranslatePropertyLabelHover,
  propertyName: string
}

export function DefaultPropertyLabelComponent({
  selectorIsValid,
  selectorIsHidden,
  selectorLabel,
  translatePropertyLabelHover,
  propertyName
}:PropertyLabelComponentProps) {
  return (
    <label className={ !selectorIsValid	? 'invalid'	: undefined}
           title={translatePropertyLabelHover(propertyName)}>
      <span className={selectorIsHidden ? "hidden-property" : ""}>{selectorLabel}</span>
    </label>
  );
}

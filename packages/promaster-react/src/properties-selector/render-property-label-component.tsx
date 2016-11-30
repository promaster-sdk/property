import * as React from "react";
import {TranslatePropertyLabelHover} from "./types";

export interface RenderPropertyLabelComponentProps {selectorIsValid: boolean,
  selectorIsHidden: boolean,
  selectorLabel: string,
  translatePropertyLabelHover: TranslatePropertyLabelHover,
  propertyName: string
}

export function RenderPropertyLabelComponent({
  selectorIsValid,
  selectorIsHidden,
  selectorLabel,
  translatePropertyLabelHover,
  propertyName
}:RenderPropertyLabelComponentProps) {
  return (
    <label className={ !selectorIsValid	? 'invalid'	: undefined}
           title={translatePropertyLabelHover(propertyName)}>
      <span className={selectorIsHidden ? "hidden-property" : ""}>{selectorLabel}</span>
    </label>
  );
}

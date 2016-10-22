import * as React from "react";

export type TranslateHiddenProperty = () => string;

export interface PropertySelectorRowProps {
  readonly key?: string,
  readonly propertyName: string,
  readonly isHidden: boolean,
  readonly label: string,
  readonly translatePropertyLabelHover: (propertyName: string) => string,
  readonly isValid: boolean,
  readonly renderedSelectorElement: any,
  readonly translateHiddenProperty: TranslateHiddenProperty
}

export function PropertySelectorRow({
  propertyName,
  isHidden,
  label,
  translatePropertyLabelHover,
  isValid,
  renderedSelectorElement,
  translateHiddenProperty
}:PropertySelectorRowProps) {

  return (
    <div className="property-selector-row">
      <label className={ !isValid	? 'invalid'	: undefined}
             title={ translatePropertyLabelHover(propertyName)}>
        <span className="hidden-property"> { isHidden ? `(${translateHiddenProperty()}` : ""}</span>
        {label}
      </label>
      {renderedSelectorElement}
    </div>
  );
}

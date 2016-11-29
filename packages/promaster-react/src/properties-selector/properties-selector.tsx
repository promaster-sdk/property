import * as React from "react";
import {PropertyValueSet} from "@promaster/promaster-primitives";
import {PropertyFiltering} from "@promaster/promaster-portable";
import {RenderPropertySelectorsParametersStyles} from "./render-property-selectors-styles";
import {
  PropertySelectionOnChange,
  AmountFormat,
  OnPropertyFormatChanged,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  TranslatePropertyName,
  Property, TranslatePropertyLabelHover, TranslateGroupName, RenderedPropertySelector,
  RenderedPropertyLabels,
} from "./types";
import {renderPropertySelectors} from "./render-property-selectors";
import {PropertiesSelectorLayoutDefault} from "./properties-selector-layout-default";

export interface PropertiesSelectorProps {

  // Required inputs
  readonly productProperties: Array<Property>
  readonly selectedProperties: PropertyValueSet.PropertyValueSet,
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,

  // Includes the raw property name and value in paranthesis
  readonly includeCodes: boolean,
  // Will render properties that according to their rule should be hidden
  readonly includeHiddenProperties: boolean,
  // Will automatically select values for properties that have only one valid value
  readonly autoSelectSingleValidValue: boolean

  // Events
  readonly onChange: PropertySelectionOnChange,
  readonly onPropertyFormatChanged: OnPropertyFormatChanged,

  // Translations
  readonly translatePropertyName: TranslatePropertyName,
  readonly translatePropertyValue: TranslatePropertyValue,
  readonly translateValueMustBeNumericMessage: TranslateNotNumericMessage,
  readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage,
  readonly translatePropertyLabelHover: TranslatePropertyLabelHover,
  readonly translateGroupName: TranslateGroupName,

  // Specifies property names of properties that should be read-only
  readonly readOnlyProperties: Array<string>,
  // Specifies property names of properties that should be optional (only for amounts for now)
  readonly optionalProperties: Array<string>,
  // Specifies input format per property name for entering amount properties (measure unit and decimal count)
  readonly propertyFormats: {[key: string]: AmountFormat},

  readonly styles: RenderPropertySelectorsParametersStyles,
}

export function PropertiesSelector(props: PropertiesSelectorProps): React.ReactElement<PropertiesSelectorProps> {

  const {translatePropertyLabelHover, translateGroupName} = props;
  const selectors = renderPropertySelectors(props);
  const labels = renderPropertyLabels(translatePropertyLabelHover, selectors);

  return <PropertiesSelectorLayoutDefault selectors={selectors}
                                          labels={labels}
                                          translateGroupName={translateGroupName}
                                          closedGroups={[]}
                                          onToggleGroupClosed={() => ""}/>;

}

function renderPropertyLabels(translatePropertyLabelHover: TranslatePropertyLabelHover,
                              selectors: Array<RenderedPropertySelector>): RenderedPropertyLabels {

  const labels: RenderedPropertyLabels = selectors
    .map((selector) => ({
      [selector.propertyName]: renderLabel(selector, translatePropertyLabelHover),
    }))
    .reduce((prev, curr) => Object.assign(prev, curr));
  return labels;
}

function renderLabel(selector: RenderedPropertySelector,
                     translatePropertyLabelHover: TranslatePropertyLabelHover) {
  return (
    <label className={ !selector.isValid	? 'invalid'	: undefined}
           title={translatePropertyLabelHover(selector.propertyName)}>
      <span className={selector.isHidden ? "hidden-property" : ""}>{selector.label}</span>
    </label>
  );
}
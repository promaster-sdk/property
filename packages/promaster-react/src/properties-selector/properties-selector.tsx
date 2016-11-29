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
  Property, TranslatePropertyLabelHover, TranslateGroupName,
} from "./types";
import {renderPropertySelectors} from "./render-property-selectors";
import {DefaultLayoutComponent, LayoutComponentProps} from "./default-layout-component";
import ComponentClass = React.ComponentClass;
import StatelessComponent = React.StatelessComponent;
import {GroupComponentProps, DefaultGroupComponent} from "./default-group-component";
import {GroupItemComponentProps, DefaultGroupItemComponent} from "./default-group-item-component";

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

  // Override layout
  readonly LayoutComponent?: ReactComponent<LayoutComponentProps>,
  readonly GroupComponent?: ReactComponent<GroupComponentProps>,
  readonly GroupItemComponent?: ReactComponent<GroupItemComponentProps>,
}

export type ReactComponent<T> = ComponentClass<T> | StatelessComponent<T>;

export function PropertiesSelector(props: PropertiesSelectorProps): React.ReactElement<PropertiesSelectorProps> {

  const {
    translateGroupName, LayoutComponent = DefaultLayoutComponent,
    GroupComponent = DefaultGroupComponent, GroupItemComponent = DefaultGroupItemComponent
  } = props;
  const selectors = renderPropertySelectors(props);

  return <LayoutComponent selectors={selectors}
                          translateGroupName={translateGroupName}
                          closedGroups={[]}
                          onToggleGroupClosed={() => ""}
                          GroupComponent={GroupComponent}
                          GroupItemComponent={GroupItemComponent} />;

}

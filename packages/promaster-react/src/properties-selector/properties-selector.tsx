import * as React from "react";
import {
  Units,
  PropertyValueSet,
  Quantity,
  PropertyValue,
  PropertyFilter
} from "@promaster/promaster-primitives";

import {PropertyFiltering} from "@promaster/promaster-portable";
import {
  PropertySelectionOnChange,
  AmountFormat,
  OnPropertyFormatChanged,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  TranslatePropertyName,
  Property, TranslatePropertyLabelHover, TranslateGroupName,
  RenderedPropertySelector,
  PropertyValueItem,
} from "./types";
import {DefaultLayoutComponent, LayoutComponentProps} from "./default-layout-component";
import ComponentClass = React.ComponentClass;
import StatelessComponent = React.StatelessComponent;
import {GroupComponentProps, DefaultGroupComponent} from "./default-group-component";
import {GroupItemComponentProps, DefaultGroupItemComponent} from "./default-group-item-component";
import {AmountPropertySelectorStyles, ComboboxPropertySelectorStyles, TextboxPropertySelectorStyles} from "../property-selectors/index";
import {PropertiesSelectorProps} from "./properties-selector";
import {RenderPropertySelectorComponent} from "./render-property-selector-component";
import {RenderPropertyLabelComponent, RenderPropertyLabelComponentProps} from "./render-property-label-component";

export interface RenderPropertySelectorsParametersStyles {
  amountPropertySelectorStyles?: AmountPropertySelectorStyles,
  comboboxPropertySelectorStyles?: ComboboxPropertySelectorStyles,
  textboxPropertySelectorStyles?: TextboxPropertySelectorStyles
}

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

function renderPropertySelectors({
  productProperties,
  selectedProperties,
  filterPrettyPrint,

  includeCodes,
  includeHiddenProperties,
  autoSelectSingleValidValue,

  onChange,
  onPropertyFormatChanged,

  translatePropertyName,
  translatePropertyValue,
  translateValueMustBeNumericMessage,
  translateValueIsRequiredMessage,
  translatePropertyLabelHover,

  readOnlyProperties,
  optionalProperties,
  propertyFormats,

  styles,

}: PropertiesSelectorProps): Array<RenderedPropertySelector> {

  // Default true if not specified otherwise
  autoSelectSingleValidValue = (autoSelectSingleValidValue === null || autoSelectSingleValidValue === undefined) ? true : autoSelectSingleValidValue;

  // const sortedArray = R.sortBy((p) => p.sortNo, productProperties);
  const sortedArray = productProperties.slice().sort((a, b) => a.sortNo < b.sortNo ? -1 : a.sortNo > b.sortNo ? 1 : 0);

  const selectorDefinitions: Array<RenderedPropertySelector> = sortedArray
    .filter((property: Property) => includeHiddenProperties || PropertyFilter.isValid(selectedProperties, property.visibilityFilter))
    .map((property: Property) => {

      const selectedValue = PropertyValueSet.getValue(property.name, selectedProperties);
      const selectedValueItem = property.valueItems && property.valueItems
          .find((value: PropertyValueItem) =>
          (value.value === undefined && selectedValue === undefined) || (value.value && PropertyValue.equals(selectedValue, value.value)));

      let isValid: boolean;
      let defaultFormat: AmountFormat = {unit: Units.One, decimalCount: 2};
      switch (getPropertyType(property.quantity)) {
        case "integer":
          isValid = selectedValueItem ? PropertyFilter.isValid(selectedProperties, selectedValueItem.validationFilter) : false;
          break;
        case "amount":
          defaultFormat = selectedValue && selectedValue.type === "amount" ?
            {unit: selectedValue.value.unit, decimalCount: selectedValue.value.decimalCount} : defaultFormat;
          isValid = property.validationFilter && PropertyFilter.isValid(selectedProperties, property.validationFilter);
          break;
        default:
          isValid = true;
      }

      const isReadOnly = readOnlyProperties.indexOf(property.name) !== -1;
      // TODO: Better handling of format to use when the format is missing in the map
      const propertyFormat = propertyFormats[property.name] || defaultFormat;

      const isHidden = !PropertyFilter.isValid(selectedProperties, property.visibilityFilter);
      const label = translatePropertyName(property.name) + (includeCodes ? ' (' + property.name + ')' : '');

      const renderPropertySelectorComponentProps = {
        propertyName: property.name,
        quantity: property.quantity,
        validationFilter: property.validationFilter,
        valueItems: property.valueItems,
        selectedValue,
        selectedProperties,
        includeCodes,
        optionalProperties,
        onChange: handleChange(onChange, productProperties, autoSelectSingleValidValue),
        onPropertyFormatChanged,
        filterPrettyPrint,
        propertyFormat,
        readOnly: isReadOnly,
        locked: autoSelectSingleValidValue
          ? !!getSingleValidValueOrUndefined(property, selectedProperties)
          : false,
        translatePropertyValue,
        translateValueMustBeNumericMessage: translateValueMustBeNumericMessage,
        translateValueIsRequiredMessage,
        styles
      };

      const renderPropertyLabelComponentProps: RenderPropertyLabelComponentProps = {
        propertyName: property.name,
        selectorIsValid: isValid,
        selectorIsHidden: isHidden,
        selectorLabel: label,
        translatePropertyLabelHover,
      };

      return {
        sortNo: property.sortNo,
        propertyName: property.name,
        groupName: property.group,

        isValid: isValid,
        isHidden: isHidden,

        label: label,

        renderedSelectorElement: <RenderPropertySelectorComponent {...renderPropertySelectorComponentProps} />,
        renderedLabelElement: <RenderPropertyLabelComponent {...renderPropertyLabelComponentProps} />,
      };
    });

  return selectorDefinitions;

}

function getPropertyType(quantity: Quantity.Quantity): PropertyValue.PropertyType {

  switch (quantity) {
    case "Text":
      return "text";
    case "Discrete":
      return "integer";
    default:
      return "amount";
  }

}

function getSingleValidValueOrUndefined(productProperty: Property, properties: PropertyValueSet.PropertyValueSet): PropertyValueItem | undefined {
  if (productProperty.quantity === "Discrete") {
    const validPropertyValueItems: PropertyValueItem[] = [];
    for (let productValueItem of productProperty.valueItems) {
      const isValid = PropertyFilter.isValid(properties, productValueItem.validationFilter);

      if (isValid) {
        validPropertyValueItems.push(productValueItem);
      }
    }

    return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : undefined;
  }

  return undefined;
}

function handleChange(externalOnChange: PropertySelectionOnChange, productProperties: Array<Property>, autoSelectSingleValidValue: boolean) {
  return (properties: PropertyValueSet.PropertyValueSet) => {

    if (!autoSelectSingleValidValue) {
      externalOnChange(properties);
      return;
    }

    let lastProperties = properties;

    for (let i = 0; i < 4; i++) {

      for (let productProperty of productProperties) {
        const propertyValueItem = getSingleValidValueOrUndefined(productProperty, properties);
        if (propertyValueItem) {
          properties = PropertyValueSet.set(productProperty.name, propertyValueItem.value, properties);
        }
      }

      if (properties === lastProperties) {
        break;
      }

      lastProperties = properties;
    }

    externalOnChange(properties);
  };
}

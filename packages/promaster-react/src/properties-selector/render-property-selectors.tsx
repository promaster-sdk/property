import * as React from "react";
// import * as R from "ramda";
import {
  Unit,
  Units,
  PropertyValueSet,
  Quantity,
  PropertyValue,
  PropertyFilter
} from "promaster-primitives";
import {PropertyFiltering} from "promaster-portable";
import {
  ComboboxPropertySelector,
  TextboxPropertySelector,
  AmountPropertySelector,
  AmountPropertySelectorClassNames,
  ComboboxPropertySelectorClassNames
} from "../property-selectors/index";
import {
  PropertySelectionOnChange,
  AmountFormat,
  OnPropertyFormatChanged,
  RenderedPropertySelector,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  TranslatePropertyName,
  Property,
  PropertyValueItem,
} from "./types";

const amountPropertySelector = React.createFactory(AmountPropertySelector);
const comboboxPropertySelector = React.createFactory(ComboboxPropertySelector);
const textboxPropertySelector = React.createFactory(TextboxPropertySelector);

export interface RenderPropertySelectorsParameters {

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
  readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage

  // Specifies property names of properties that should be read-only
  readonly readOnlyProperties: Array<string>,
  // Specifies property names of properties that should be optional (only for amounts for now)
  readonly optionalProperties: Array<string>,
  // Specifies input format per property name for entering amount properties (measure unit and decimal count)
  readonly propertyFormats: {[key: string]: AmountFormat},

  readonly classNames: RenderPropertySelectorsParametersClassNames,
}

export interface RenderPropertySelectorsParametersClassNames {
  amountPropertySelectorClassNames: AmountPropertySelectorClassNames,
  comboboxPropertySelectorClassNames: ComboboxPropertySelectorClassNames,
}

export function renderPropertySelectors({
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

  readOnlyProperties,
  optionalProperties,
  propertyFormats,

  classNames,

}: RenderPropertySelectorsParameters): Array<RenderedPropertySelector> {

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
          (value.value === null && selectedValue === null) || (value.value && PropertyValue.equals(selectedValue, value.value)));

      let isValid: boolean;
      switch (getPropertyType(property.quantity)) {
        case "integer":
          isValid = selectedValueItem ? PropertyFilter.isValid(selectedProperties, selectedValueItem.validationFilter) : false;
          break;
        case "amount":
          isValid = property.validationFilter && PropertyFilter.isValid(selectedProperties, property.validationFilter);
          break;
        default:
          isValid = true;
      }

      const isReadOnly = readOnlyProperties.indexOf(property.name) !== -1;
      // TODO: Better handling of format to use when the format is missing in the map
      const propertyFormat = propertyFormats[property.name] || {unit: Units.One, decimalCount: 2};


      return {
        sortNo: property.sortNo,
        propertyName: property.name,
        groupName: property.group,

        isValid: isValid,
        isHidden: !PropertyFilter.isValid(selectedProperties, property.visibilityFilter),

        label: translatePropertyName(property.name) + (includeCodes ? ' (' + property.name + ')' : ''),

        renderedSelectorElement: renderPropertySelector(
          property.name,
          property.quantity,
          property.validationFilter,
          property.valueItems,
          selectedValue,
          selectedProperties,
          includeCodes,
          optionalProperties,
          handleChange(onChange, productProperties, autoSelectSingleValidValue),
          onPropertyFormatChanged,
          filterPrettyPrint,
          propertyFormat,
          isReadOnly,
          autoSelectSingleValidValue
            ? !!getSingleValidValueOrNull(property, selectedProperties)
            : false,
          translatePropertyValue,
          translateValueMustBeNumericMessage,
          translateValueIsRequiredMessage,
          classNames
        )

      };
    });

  return selectorDefinitions;

}

function renderPropertySelector(propertyName: string,
                                quantity: Quantity.Quantity,
                                validationFilter: PropertyFilter.PropertyFilter,
                                valueItems: Array<PropertyValueItem>,
                                selectedValue: PropertyValue.PropertyValue,
                                selectedProperties: PropertyValueSet.PropertyValueSet,
                                includeCodes: boolean,
                                optionalProperties: Array<string>,
                                onChange: PropertySelectionOnChange,
                                onPropertyFormatChanged: OnPropertyFormatChanged,
                                filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
                                propertyFormat: AmountFormat,
                                readOnly: boolean,
                                locked: boolean,
                                translatePropertyValue: TranslatePropertyValue,
                                translateNotNumericMessage: TranslateNotNumericMessage,
                                translateValueIsRequiredMessage: TranslateValueIsRequiredMessage,
                                classNames: RenderPropertySelectorsParametersClassNames): any {

  function onValueChange(newValue: PropertyValue.PropertyValue) {
    onChange(newValue
      ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
      : PropertyValueSet.removeProperty(propertyName, selectedProperties)
    );
  }

  switch (getPropertyType(quantity)) {
    case "text":
      const value: string | undefined = selectedValue && PropertyValue.getText(selectedValue);
      if (!value)
        throw new Error("No value!");
      return textboxPropertySelector({
        value: value,
        readOnly: readOnly,
        onValueChange: onValueChange
      });
    case "integer": {

      return comboboxPropertySelector({
        sortValidFirst: true,
        propertyName: propertyName,
        propertyValueSet: selectedProperties,
        valueItems: valueItems && valueItems.map((vi) => ({
          value: vi.value,
          text: translatePropertyValue(propertyName, (vi.value ? PropertyValue.getInteger(vi.value) : null) as number),
          sortNo: vi.sortNo,
          validationFilter: vi.validationFilter
        })),
        showCodes: includeCodes,
        filterPrettyPrint: filterPrettyPrint,
        onValueChange: onValueChange,
        readOnly: readOnly,
        locked: locked,
        classNames: classNames.comboboxPropertySelectorClassNames
      });
    }
    default:
      return amountPropertySelector({
        propertyName: propertyName,
        propertyValueSet: selectedProperties,
        inputUnit: propertyFormat.unit,
        inputDecimalCount: propertyFormat.decimalCount,
        onFormatChanged: (unit: Unit.Unit<any>, decimalCount: number) => onPropertyFormatChanged(propertyName, unit, decimalCount),
        onValueChange: onValueChange,
        notNumericMessage: translateNotNumericMessage(),

        // If it is optional then use blank required message
        isRequiredMessage: optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : translateValueIsRequiredMessage(),

        validationFilter: validationFilter,
        filterPrettyPrint: filterPrettyPrint,
        readOnly: readOnly,
        classNames: classNames.amountPropertySelectorClassNames
      });
  }
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

function getSingleValidValueOrNull(productProperty: Property, properties: PropertyValueSet.PropertyValueSet): PropertyValueItem | null {
  // if (Units.getStringFromQuantityType(productProperty.quantity).toLocaleLowerCase() === 'discrete') {
  if (productProperty.quantity === "Discrete") {
    const validPropertyValueItems: PropertyValueItem[] = [];
    for (let productValueItem of productProperty.valueItems) {
      const isValid = PropertyFilter.isValid(properties, productValueItem.validationFilter);

      if (isValid) {
        validPropertyValueItems.push(productValueItem);
      }
    }

    return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : null;
  }

  return null;
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
        const propertyValueItem = getSingleValidValueOrNull(productProperty, properties);
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


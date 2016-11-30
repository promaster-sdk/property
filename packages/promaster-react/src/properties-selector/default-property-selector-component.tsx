import * as React from "react";
import {
  Unit,
  PropertyValueSet,
  Quantity,
  PropertyValue,
  PropertyFilter
} from "@promaster/promaster-primitives";
import {PropertyFiltering} from "@promaster/promaster-portable";
import {
  ComboboxPropertySelector,
  TextboxPropertySelector,
  AmountPropertySelector,
} from "../property-selectors/index";
import {
  PropertySelectionOnChange,
  AmountFormat,
  OnPropertyFormatChanged,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  PropertyValueItem, PropertySelectorStyles,
} from "./types";

const amountPropertySelector = React.createFactory(AmountPropertySelector);
const comboboxPropertySelector = React.createFactory(ComboboxPropertySelector);
const textboxPropertySelector = React.createFactory(TextboxPropertySelector);

export interface PropertySelectorComponentProps {
  propertyName: string,
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
  translateValueMustBeNumericMessage: TranslateNotNumericMessage,
  translateValueIsRequiredMessage: TranslateValueIsRequiredMessage,
  styles: PropertySelectorStyles
}

export function DefaultPropertySelectorComponent({
  propertyName,
  quantity,
  validationFilter,
  valueItems,
  selectedValue,
  selectedProperties,
  includeCodes,
  optionalProperties,
  onChange,
  onPropertyFormatChanged,
  filterPrettyPrint,
  propertyFormat,
  readOnly,
  locked,
  translatePropertyValue,
  translateValueMustBeNumericMessage,
  translateValueIsRequiredMessage,
  styles
}:PropertySelectorComponentProps): any {

  function onValueChange(newValue: PropertyValue.PropertyValue) {
    onChange(newValue
      ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
      : PropertyValueSet.removeProperty(propertyName, selectedProperties)
    );
  }

  switch (getPropertyType(quantity)) {
    case "text":
      const value: string | undefined = selectedValue && PropertyValue.getText(selectedValue);
      if (value === undefined)
        throw new Error("No value!");
      return textboxPropertySelector({
        value: value,
        readOnly: readOnly,
        onValueChange: onValueChange,
        styles: styles.textboxPropertySelectorStyles
      });
    case "integer": {

      return comboboxPropertySelector({
        sortValidFirst: true,
        propertyName: propertyName,
        propertyValueSet: selectedProperties,
        valueItems: valueItems && valueItems.map((vi) => ({
          value: vi.value,
          text: translatePropertyValue(propertyName, (vi.value ? PropertyValue.getInteger(vi.value) : undefined) as number),
          sortNo: vi.sortNo,
          validationFilter: vi.validationFilter,
          image: vi.image,
        })),
        showCodes: includeCodes,
        filterPrettyPrint: filterPrettyPrint,
        onValueChange: onValueChange,
        readOnly: readOnly,
        locked: locked,
        styles: styles.comboboxPropertySelectorStyles
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
        notNumericMessage: translateValueMustBeNumericMessage(),

        // If it is optional then use blank required message
        isRequiredMessage: optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : translateValueIsRequiredMessage(),

        validationFilter: validationFilter,
        filterPrettyPrint: filterPrettyPrint,
        readOnly: readOnly,
        styles: styles.amountPropertySelectorStyles
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

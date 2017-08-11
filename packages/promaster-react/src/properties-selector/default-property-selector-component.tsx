import * as React from "react";
import {
  Unit,
  PropertyValueSet,
  Quantity,
  PropertyValue,
  PropertyFilter
} from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import * as PropertySelectors from "../property-selectors/index";
import {
  PropertySelectionOnChange,
  AmountFormat,
  OnPropertyFormatChanged,
  OnPropertyFormatCleared,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  PropertyValueItem,
} from "./types";

// tslint:disable-next-line:variable-name
const AmountPropertySelectorDefault = PropertySelectors.createAmountPropertySelector({});
// tslint:disable-next-line:variable-name
const ComboboxPropertySelectorDefault = PropertySelectors.createComboboxPropertySelector({});
// tslint:disable-next-line:variable-name
const TextboxPropertySelectorDefault = PropertySelectors.createTextboxPropertySelector({});

export interface PropertySelectorProps {
  readonly propertyName: string,
  readonly quantity: Quantity.Quantity,
  readonly validationFilter: PropertyFilter.PropertyFilter,
  readonly valueItems: ReadonlyArray<PropertyValueItem>,
  readonly selectedValue: PropertyValue.PropertyValue,
  readonly selectedProperties: PropertyValueSet.PropertyValueSet,
  readonly includeCodes: boolean,
  readonly optionalProperties: ReadonlyArray<string>,
  readonly onChange: PropertySelectionOnChange,
  readonly onPropertyFormatChanged: OnPropertyFormatChanged,
  readonly onPropertyFormatCleared: OnPropertyFormatCleared,
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
  readonly propertyFormat: AmountFormat,
  readonly readOnly: boolean,
  readonly locked: boolean,
  readonly translatePropertyValue: TranslatePropertyValue,
  readonly translateValueMustBeNumericMessage: TranslateNotNumericMessage,
  readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage,
  readonly inputDebounceTime: number,
}

export interface CreatePropertySelectorProps {
  readonly AmountPropertySelector?: PropertySelectors.AmountPropertySelector,
  readonly ComboboxPropertySelector?: PropertySelectors.ComboboxPropertySelector,
  readonly TextboxPropertySelector?: PropertySelectors.TextboxPropertySelector,
}

export type PropertySelector = React.StatelessComponent<PropertySelectorProps>;

export function createPropertySelector({
  AmountPropertySelector = AmountPropertySelectorDefault,
  ComboboxPropertySelector = ComboboxPropertySelectorDefault,
  TextboxPropertySelector = TextboxPropertySelectorDefault,
 }: CreatePropertySelectorProps): PropertySelector {
  return function PropertySelector({
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
    onPropertyFormatCleared,
    filterPrettyPrint,
    propertyFormat,
    readOnly,
    locked,
    translatePropertyValue,
    translateValueMustBeNumericMessage,
    translateValueIsRequiredMessage,
    inputDebounceTime,
  }: PropertySelectorProps): JSX.Element {

    function onValueChange(newValue: PropertyValue.PropertyValue): void {
      onChange(newValue
        ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
        : PropertyValueSet.removeProperty(propertyName, selectedProperties)
      );
    }

    switch (getPropertyType(quantity)) {
      case "text":
        const value: string | undefined = selectedValue && PropertyValue.getText(selectedValue);
        if (value === undefined) {
          throw new Error("No value!");
        }

        return (
          <TextboxPropertySelector
            value={value}
            readOnly={readOnly}
            onValueChange={onValueChange}
            debounceTime={inputDebounceTime}
          />
        );

      case "integer":
        return (
          <ComboboxPropertySelector
            sortValidFirst={true}
            propertyName={propertyName}
            propertyValueSet={selectedProperties}
            valueItems={valueItems && valueItems.map((vi) => ({
              value: vi.value,
              text: translatePropertyValue(propertyName, (vi.value ? PropertyValue.getInteger(vi.value) : undefined) as number),
              sortNo: vi.sort_no,
              validationFilter: vi.property_filter,
              image: vi.image,
            }))}
            showCodes={includeCodes}
            filterPrettyPrint={filterPrettyPrint}
            onValueChange={onValueChange}
            readOnly={readOnly}
            locked={locked} />
        );

      default:
        return (
          <AmountPropertySelector
            propertyName={propertyName}
            propertyValueSet={selectedProperties}
            inputUnit={propertyFormat.unit}
            inputDecimalCount={propertyFormat.decimalCount}
            onFormatChanged={(unit: Unit.Unit<Quantity.Quantity>, decimalCount: number) => onPropertyFormatChanged(propertyName, unit, decimalCount)}
            onFormatCleared={() => onPropertyFormatCleared(propertyName)}
            onValueChange={onValueChange}
            notNumericMessage={translateValueMustBeNumericMessage()}

            // If it is optional then use blank required message
            isRequiredMessage={optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : translateValueIsRequiredMessage()}

            validationFilter={validationFilter}
            filterPrettyPrint={filterPrettyPrint}
            readOnly={readOnly}
            debounceTime={inputDebounceTime}
          />
        );
    }
  };
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

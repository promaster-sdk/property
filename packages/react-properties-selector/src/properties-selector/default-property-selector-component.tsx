import React from "react";
import { Unit, UnitFormat, UnitMap } from "uom";
import { PropertyValueSet, PropertyValue, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  PropertySelectorType,
  PropertySelectionOnChange,
  AmountFormat,
  OnPropertyFormatChanged,
  OnPropertyFormatCleared,
  OnPropertyFormatSelectorToggled,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  PropertyValueItem,
} from "./types";
import { CheckboxPropertySelector, createCheckboxPropertySelector } from "../checkbox";
import { createTextboxPropertySelector, TextboxPropertySelector } from "../textbox";
import { createRadioGroupPropertySelector, RadioGroupPropertySelector } from "../radio-group";
import { ComboboxPropertySelector, createComboboxPropertySelector } from "../combo-box";
import { AmountPropertySelector, createAmountPropertySelector } from "../amount";

const AmountPropertySelectorDefault = createAmountPropertySelector({});
const ComboboxPropertySelectorDefault = createComboboxPropertySelector({});
const CheckboxPropertySelectorDefault = createCheckboxPropertySelector({});
const TextboxPropertySelectorDefault = createTextboxPropertySelector({});
const RadioGroupPropertySelectorDefault = createRadioGroupPropertySelector({});

export interface PropertySelectorProps {
  readonly selectorType: PropertySelectorType;
  readonly fieldName: string;
  readonly propertyName: string;
  readonly quantity: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly valueItems: ReadonlyArray<PropertyValueItem>;
  readonly selectedProperties: PropertyValueSet.PropertyValueSet;
  readonly includeCodes: boolean;
  readonly optionalProperties: ReadonlyArray<string>;
  readonly onChange: PropertySelectionOnChange;
  readonly onPropertyFormatChanged: OnPropertyFormatChanged;
  readonly onPropertyFormatCleared: OnPropertyFormatCleared;
  readonly onPropertyFormatSelectorToggled: OnPropertyFormatSelectorToggled;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly propertyFormat: AmountFormat;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly translatePropertyValue: TranslatePropertyValue;
  readonly translateValueMustBeNumericMessage: TranslateNotNumericMessage;
  readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage;
  readonly inputDebounceTime: number;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  // readonly units: {
  //   readonly [key: string]: Unit.Unit;
  // };
  readonly units: UnitMap.UnitMap;
}

export interface CreatePropertySelectorProps {
  readonly AmountPropertySelector?: AmountPropertySelector;
  readonly ComboboxPropertySelector?: ComboboxPropertySelector;
  readonly TextboxPropertySelector?: TextboxPropertySelector;
  readonly RadioGroupPropertySelector?: RadioGroupPropertySelector;
  readonly CheckboxPropertySelector?: CheckboxPropertySelector;
}

export type PropertySelector = React.StatelessComponent<PropertySelectorProps>;

export function createPropertySelector({
  AmountPropertySelector = AmountPropertySelectorDefault,
  ComboboxPropertySelector = ComboboxPropertySelectorDefault,
  TextboxPropertySelector = TextboxPropertySelectorDefault,
  RadioGroupPropertySelector = RadioGroupPropertySelectorDefault,
  CheckboxPropertySelector = CheckboxPropertySelectorDefault,
}: CreatePropertySelectorProps): PropertySelector {
  return function PropertySelector({
    selectorType,
    fieldName,
    propertyName,
    quantity,
    validationFilter,
    valueItems,
    selectedProperties,
    includeCodes,
    optionalProperties,
    onChange,
    onPropertyFormatChanged,
    onPropertyFormatCleared,
    onPropertyFormatSelectorToggled,
    filterPrettyPrint,
    propertyFormat,
    readOnly,
    locked,
    translatePropertyValue,
    translateValueMustBeNumericMessage,
    translateValueIsRequiredMessage,
    inputDebounceTime,
    unitsFormat,
    units,
  }: PropertySelectorProps): JSX.Element {
    function onValueChange(newValue: PropertyValue.PropertyValue): void {
      onChange(
        newValue
          ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
          : PropertyValueSet.removeProperty(propertyName, selectedProperties),
        propertyName
      );
    }

    switch (getPropertyType(quantity)) {
      case "text":
        return (
          <TextboxPropertySelector
            propertyName={propertyName}
            propertyValueSet={selectedProperties}
            readOnly={readOnly}
            onValueChange={onValueChange}
            debounceTime={inputDebounceTime}
          />
        );

      case "integer":
        if (selectorType === "RadioGroup") {
          return (
            <RadioGroupPropertySelector
              propertyName={propertyName}
              propertyValueSet={selectedProperties}
              valueItems={
                valueItems &&
                valueItems.map((vi) => ({
                  value: vi.value,
                  text: translatePropertyValue(
                    propertyName,
                    (vi.value ? PropertyValue.getInteger(vi.value) : undefined) as number
                  ),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image,
                }))
              }
              showCodes={includeCodes}
              filterPrettyPrint={filterPrettyPrint}
              onValueChange={onValueChange}
              readOnly={readOnly}
              locked={locked}
            />
          );
        } else if (selectorType === "Checkbox") {
          return (
            <CheckboxPropertySelector
              propertyName={propertyName}
              propertyValueSet={selectedProperties}
              valueItems={
                valueItems &&
                valueItems.map((vi) => ({
                  value: vi.value,
                  text: translatePropertyValue(
                    propertyName,
                    (vi.value ? PropertyValue.getInteger(vi.value) : undefined) as number
                  ),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image,
                }))
              }
              showCodes={includeCodes}
              filterPrettyPrint={filterPrettyPrint}
              onValueChange={onValueChange}
              readOnly={readOnly}
              locked={locked}
            />
          );
        } else {
          return (
            <ComboboxPropertySelector
              sortValidFirst={true}
              propertyName={propertyName}
              propertyValueSet={selectedProperties}
              valueItems={
                valueItems &&
                valueItems.map((vi) => ({
                  value: vi.value,
                  text: translatePropertyValue(
                    propertyName,
                    (vi.value ? PropertyValue.getInteger(vi.value) : undefined) as number
                  ),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image,
                }))
              }
              showCodes={includeCodes}
              filterPrettyPrint={filterPrettyPrint}
              onValueChange={onValueChange}
              readOnly={readOnly}
              locked={locked}
            />
          );
        }

      default:
        return (
          <AmountPropertySelector
            propertyName={propertyName}
            propertyValueSet={selectedProperties}
            inputUnit={propertyFormat.unit}
            inputDecimalCount={propertyFormat.decimalCount}
            onFormatChanged={(unit: Unit.Unit<unknown>, decimalCount: number) =>
              onPropertyFormatChanged(propertyName, unit, decimalCount)
            }
            onFormatCleared={() => onPropertyFormatCleared(propertyName)}
            onFormatSelectorToggled={(active: boolean) => onPropertyFormatSelectorToggled(propertyName, active)}
            onValueChange={onValueChange}
            notNumericMessage={translateValueMustBeNumericMessage()}
            fieldName={fieldName}
            // If it is optional then use blank required message
            isRequiredMessage={
              optionalProperties && optionalProperties.indexOf(propertyName) !== -1
                ? ""
                : translateValueIsRequiredMessage()
            }
            validationFilter={validationFilter}
            filterPrettyPrint={filterPrettyPrint}
            readOnly={readOnly}
            debounceTime={inputDebounceTime}
            unitsFormat={unitsFormat}
            units={units}
          />
        );
    }
  };
}

function getPropertyType(quantity: string): PropertyValue.PropertyType {
  switch (quantity) {
    case "Text":
      return "text";
    case "Discrete":
      return "integer";
    default:
      return "amount";
  }
}

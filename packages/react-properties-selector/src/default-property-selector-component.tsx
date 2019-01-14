import * as React from "react";
import { Unit, Quantity, UnitFormat } from "uom";
import {
  PropertyValueSet,
  PropertyValue,
  PropertyFilter
} from "@promaster/property";
import * as PropertyFiltering from "@promaster/property-filter-pretty";
import * as PropertySelectors from "@promaster/react-property-selectors";
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
  PropertyValueItem
} from "./types";

// tslint:disable-next-line:variable-name
const AmountPropertySelectorDefault = PropertySelectors.createAmountPropertySelector(
  {}
);
// tslint:disable-next-line:variable-name
const ComboboxPropertySelectorDefault = PropertySelectors.createComboboxPropertySelector(
  {}
);
// tslint:disable-next-line:variable-name
const CheckboxPropertySelectorDefault = PropertySelectors.createCheckboxPropertySelector(
  {}
);
// tslint:disable-next-line:variable-name
const TextboxPropertySelectorDefault = PropertySelectors.createTextboxPropertySelector(
  {}
);
// tslint:disable-next-line:variable-name
const RadioGroupPropertySelectorDefault = PropertySelectors.createRadioGroupPropertySelector(
  {}
);

export interface PropertySelectorProps {
  readonly selectorType: PropertySelectorType;
  readonly fieldName: string;
  readonly propertyName: string;
  readonly quantity: Quantity.Quantity;
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
}

export interface CreatePropertySelectorProps {
  readonly AmountPropertySelector?: PropertySelectors.AmountPropertySelector;
  readonly ComboboxPropertySelector?: PropertySelectors.ComboboxPropertySelector;
  readonly TextboxPropertySelector?: PropertySelectors.TextboxPropertySelector;
  readonly RadioGroupPropertySelector?: PropertySelectors.RadioGroupPropertySelector;
  readonly CheckboxPropertySelector?: PropertySelectors.CheckboxPropertySelector;
}

export type PropertySelector = React.StatelessComponent<PropertySelectorProps>;

export function createPropertySelector({
  AmountPropertySelector = AmountPropertySelectorDefault,
  ComboboxPropertySelector = ComboboxPropertySelectorDefault,
  TextboxPropertySelector = TextboxPropertySelectorDefault,
  RadioGroupPropertySelector = RadioGroupPropertySelectorDefault,
  CheckboxPropertySelector = CheckboxPropertySelectorDefault
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
    unitsFormat
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
                valueItems.map(vi => ({
                  value: vi.value,
                  text: translatePropertyValue(propertyName, (vi.value
                    ? PropertyValue.getInteger(vi.value)
                    : undefined) as number),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image
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
                valueItems.map(vi => ({
                  value: vi.value,
                  text: translatePropertyValue(propertyName, (vi.value
                    ? PropertyValue.getInteger(vi.value)
                    : undefined) as number),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image
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
                valueItems.map(vi => ({
                  value: vi.value,
                  text: translatePropertyValue(propertyName, (vi.value
                    ? PropertyValue.getInteger(vi.value)
                    : undefined) as number),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image
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
            onFormatChanged={(
              unit: Unit.Unit<Quantity.Quantity>,
              decimalCount: number
            ) => onPropertyFormatChanged(propertyName, unit, decimalCount)}
            onFormatCleared={() => onPropertyFormatCleared(propertyName)}
            onFormatSelectorToggled={(active: boolean) =>
              onPropertyFormatSelectorToggled(propertyName, active)
            }
            onValueChange={onValueChange}
            notNumericMessage={translateValueMustBeNumericMessage()}
            fieldName={fieldName}
            // If it is optional then use blank required message
            isRequiredMessage={
              optionalProperties &&
              optionalProperties.indexOf(propertyName) !== -1
                ? ""
                : translateValueIsRequiredMessage()
            }
            validationFilter={validationFilter}
            filterPrettyPrint={filterPrettyPrint}
            readOnly={readOnly}
            debounceTime={inputDebounceTime}
            unitsFormat={unitsFormat}
          />
        );
    }
  };
}

function getPropertyType(
  quantity: Quantity.Quantity
): PropertyValue.PropertyType {
  switch (quantity) {
    case "Text":
      return "text";
    case "Discrete":
      return "integer";
    default:
      return "amount";
  }
}

import * as React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import {
  createComboBoxStandardOption,
  ComboBoxStandardOptionProps,
  ComboBoxStandardSelect,
  ComboBoxStandardSelectProps,
  ImageDropdownSelector,
  createImageDropdownSelector,
} from "../combo-box-elements/index";
import styled, { css, InterpolationValue } from "styled-components";

export interface ComboBoxPropertyValueItem {
  readonly value: PropertyValue.PropertyValue | undefined | null,
  readonly sortNo: number,
  readonly text: string,
  readonly image?: string,
  readonly validationFilter: PropertyFilter.PropertyFilter
}

export interface ComboboxPropertySelectorProps {
  readonly sortValidFirst: boolean,
  readonly propertyName: string,
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet,
  readonly valueItems: ReadonlyArray<ComboBoxPropertyValueItem>,
  readonly showCodes: boolean,
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void,
  readonly readOnly: boolean,
  readonly locked: boolean,
}

export interface CreateComboboxPropertySelectorParams {
  readonly ComboBoxStandardOption?: React.ComponentType<ComboBoxStandardOptionProps>
  readonly ComboBoxStandardSelect?: React.ComponentType<ComboBoxStandardSelectProps>
  readonly ComboBoxImageDropdownSelector?: ImageDropdownSelector
}

export type ComboboxPropertySelector = React.StatelessComponent<ComboboxPropertySelectorProps>;

function standardSelectStyles(props: ComboBoxStandardSelectProps): Array<InterpolationValue> {
  if (!props.isSelectedItemValid && props.locked) {
    return css`
      background: lightgray;
      color: red;
      border: none;    
    `;
  } else if (!props.isSelectedItemValid) {
    return css`color: red;`;
  } else if (props.locked) {
    return css`
      background: lightgray;
      color: darkgray;
      border: none;
    `;
  }

  return css``;
}

const defaultComboBoxStandardOption = createComboBoxStandardOption({});
const defaultImageDropdownSelector = createImageDropdownSelector({});
export const defaultComboBoxStandardSelect = styled(ComboBoxStandardSelect) `
  color: black;
  height: 30px;
  border: 1px solid #b4b4b4;
  border-radius: 3px;
  font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
  outline: rgb(131, 131, 131) none 0px;
  padding: 1px 30px 0px 10px;

  ${standardSelectStyles}
`;

export function createComboboxPropertySelector({
ComboBoxStandardOption = defaultComboBoxStandardOption,
  ComboBoxStandardSelect = defaultComboBoxStandardSelect,
  ComboBoxImageDropdownSelector = defaultImageDropdownSelector,
}: CreateComboboxPropertySelectorParams): ComboboxPropertySelector {
  return function ComboboxPropertySelector({
    sortValidFirst,
    propertyName,
    propertyValueSet,
    valueItems,
    showCodes,
    onValueChange,
    filterPrettyPrint,
    readOnly,
    locked,
}: ComboboxPropertySelectorProps): React.ReactElement<ComboboxPropertySelectorProps> {

    const value = PropertyValueSet.getInteger(propertyName, propertyValueSet);

    if (!valueItems) {
      valueItems = [];
    }
    const selectedValueItemOrUndefined = valueItems.find((item) => (item.value && PropertyValue.getInteger(item.value)) === value);
    let selectedValueItem: ComboBoxPropertyValueItem;
    if (!selectedValueItemOrUndefined) {
      selectedValueItem = {
        value: undefined,
        sortNo: -1,
        text: (value === undefined || value === null) ? "" : value.toString(),
        validationFilter: PropertyFilter.Empty
      };
      // Add value items for selected value, even tough it does not really exist, but we need to show it in the combobox
      // valueItems.unshift(selectedValueItem);
      valueItems = [selectedValueItem, ...valueItems] as ReadonlyArray<ComboBoxPropertyValueItem>;
    } else {
      selectedValueItem = selectedValueItemOrUndefined;
    }

    interface Option {
      readonly value: string,
      readonly label: string,
      readonly isItemValid: boolean,
      readonly image: string | undefined,
      readonly sortNo: number,
      readonly toolTip: string
    }

    // Convert value items to options
    const options: Array<Option> = valueItems
      .map((valueItem) => {
        const isItemValid = _isValueItemValid(propertyName, propertyValueSet, valueItem);
        return {
          value: _getItemValue(valueItem),
          label: _getItemLabel(valueItem, showCodes),
          isItemValid: isItemValid,
          image: valueItem.image,
          sortNo: valueItem.sortNo,
          toolTip: isItemValid ? "" : _getItemInvalidMessage(valueItem, filterPrettyPrint)
        };
      }).sort((a, b) => {
        if (sortValidFirst) {
          if (a.isItemValid && !b.isItemValid) {
            return -1;
          }
          if (!a.isItemValid && b.isItemValid) {
            return 1;
          }
        }

        if (a.sortNo < b.sortNo) {
          return -1;
        }
        if (a.sortNo > b.sortNo) {
          return 1;
        }
        return 0;
      });

    const selectedOption = options.find((option) => option.value === _getItemValue(selectedValueItem));
    if (!selectedOption) {
      throw new Error("Could not find..");
    }

    if (valueItems.some((i) => i.image !== undefined)) {
      const dropdownOptions = options.map((option) => (
        {
          value: option.value,
          label: (option.isItemValid ? "" : "✘ ") + option.label,
          tooltip: option.toolTip,
          isItemValid: option.isItemValid,
          imageUrl: option.image,
        })
      );
      return (
        <ComboBoxImageDropdownSelector
          isSelectedItemValid={selectedOption.isItemValid}
          locked={locked}
          value={selectedOption.value}
          options={dropdownOptions}
          onChange={(e) => _doOnChange(e, onValueChange)} />
      );

    }

    return (
      <ComboBoxStandardSelect
        isSelectedItemValid={selectedOption.isItemValid}
        locked={locked}
        disabled={readOnly || locked}
        value={selectedOption.value}
        title={selectedOption.toolTip}
        onChange={(event) => _doOnChange(event.currentTarget.value, onValueChange)}>
        {
          options.map((option) => (
            <ComboBoxStandardOption
              key={option.value}
              toolTip={option.toolTip}
              isItemValid={option.isItemValid}
              label={option.label}
              value={option.value} />
          ))
        }
      </ComboBoxStandardSelect>);

  };
}

function _getItemLabel(valueItem: ComboBoxPropertyValueItem, showCodes: boolean): string {

  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return valueItem.text + (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "");
}

function _doOnChange(newValue: string, onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void): void {
  if (newValue === undefined || newValue === null) {
    onValueChange(undefined);
  } else {
    onValueChange(PropertyValue.create("integer", parseInt(newValue, 10)));
  }
}

function _getItemValue(valueItem: ComboBoxPropertyValueItem): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return PropertyValue.toString(valueItem.value);
}

function _getItemInvalidMessage(valueItem: ComboBoxPropertyValueItem, filterPrettyPrint: PropertyFiltering.FilterPrettyPrint): string {
  return filterPrettyPrint(valueItem.validationFilter);
}

function _isValueItemValid(propertyName: string, propertyValueSet: PropertyValueSet.PropertyValueSet, valueItem: ComboBoxPropertyValueItem): boolean {

  if (valueItem.value === undefined || valueItem.value === null) {
    return true;
  }
  let pvsToCheck = PropertyValueSet.set(propertyName, valueItem.value, propertyValueSet);
  if (!valueItem.validationFilter) {
    return true;
  }
  return PropertyFilter.isValid(pvsToCheck, valueItem.validationFilter);

}

import * as React from "react";
import {
  PropertyFilter,
  PropertyValue,
  PropertyValueSet
} from "@promaster/property";
import * as PropertyFiltering from "@promaster/property-filtering";
import { RadioGroupProps, RadioGroup } from "./radio-group";
import { RadioGroupItemProps, RadioGroupItem } from "./radio-group-item";
import Styled from "styled-components";

export interface RadioGroupPropertyValueItem {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
}

export interface RadioGroupPropertySelectorProps {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<RadioGroupPropertyValueItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly readOnly: boolean;
  readonly locked: boolean;
}

export interface CreateRadioGroupPropertySelectorParams {
  readonly RadioGroupItem?: React.ComponentType<RadioGroupItemProps>;
  readonly RadioGroup?: React.ComponentType<RadioGroupProps>;
}

export type RadioGroupPropertySelector = React.StatelessComponent<
  RadioGroupPropertySelectorProps
>;

const defaultRadioGroupItem = Styled(RadioGroupItem)`
  cursor: ${(p: RadioGroupItemProps) =>
    p.isItemValid ? "pointer" : "not-allowed"};
  display: inline-block;
  margin-right: 10px;
  padding: 10px;
  border: ${(p: RadioGroupItemProps) =>
    p.selected
      ? "2px solid " + (p.isItemValid ? "#39f" : "red")
      : "2px solid transparent"};
  color: ${(p: RadioGroupItemProps) => (p.isItemValid ? "black" : "grey")};

  ${(p: RadioGroupItemProps) =>
    p.isItemValid ? "&:hover { background: #39f; color: white;" : ""}
`;
const defaultRadioGroup = Styled(RadioGroup)``;

export function createRadioGroupPropertySelector({
  RadioGroupItem = defaultRadioGroupItem,
  RadioGroup = defaultRadioGroup
}: CreateRadioGroupPropertySelectorParams): RadioGroupPropertySelector {
  return function RadioGroupPropertySelector({
    propertyName,
    propertyValueSet,
    valueItems,
    showCodes,
    onValueChange,
    filterPrettyPrint,
    readOnly,
    locked
  }: RadioGroupPropertySelectorProps): React.ReactElement<
    RadioGroupPropertySelectorProps
  > {
    const value = PropertyValueSet.getValue(propertyName, propertyValueSet);

    if (!valueItems) {
      valueItems = [];
    }

    // Convert value items to options
    const items: Array<RadioGroupItemProps> = valueItems
      .map(valueItem => {
        const isItemValid = _isValueItemValid(
          propertyName,
          propertyValueSet,
          valueItem
        );
        return {
          key: valueItem.sortNo.toString(),
          sortNo: valueItem.sortNo,
          selected: valueItem.value
            ? PropertyValue.equals(value, valueItem.value)
            : false,
          label: _getItemLabel(valueItem, showCodes),
          imageUrl: valueItem.image,
          toolTip: isItemValid
            ? ""
            : _getItemInvalidMessage(valueItem, filterPrettyPrint),
          onClick: () =>
            !readOnly && valueItem.value && onValueChange(valueItem.value),
          isItemValid: isItemValid
        };
      })
      .sort((a, b) => a.sortNo - b.sortNo);

    return (
      <RadioGroup locked={locked}>
        {items.map(item => <RadioGroupItem {...item} />)}
      </RadioGroup>
    );
  };
}

function _getItemLabel(
  valueItem: RadioGroupPropertyValueItem,
  showCodes: boolean
): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return (
    valueItem.text +
    (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "")
  );
}

function _getItemInvalidMessage(
  valueItem: RadioGroupPropertyValueItem,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint
): string {
  return filterPrettyPrint(valueItem.validationFilter);
}

function _isValueItemValid(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItem: RadioGroupPropertyValueItem
): boolean {
  if (valueItem.value === undefined || valueItem.value === null) {
    return true;
  }
  let pvsToCheck = PropertyValueSet.set(
    propertyName,
    valueItem.value,
    propertyValueSet
  );
  if (!valueItem.validationFilter) {
    return true;
  }
  return PropertyFilter.isValid(pvsToCheck, valueItem.validationFilter);
}

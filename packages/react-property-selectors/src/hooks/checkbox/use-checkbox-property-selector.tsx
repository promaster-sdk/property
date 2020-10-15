import React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type UseCheckboxPropertySelectorOptions = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<UseCheckboxPropertyValueItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly comparer?: PropertyValue.Comparer;
};

export interface UseCheckboxPropertyValueItem {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
}

export type UseCheckboxPropertySelector = {
  readonly label: string;
  readonly image?: string;
  readonly locked: boolean;
  readonly checked: boolean;
  readonly getContainerDivProps: () => React.HTMLAttributes<HTMLDivElement>;
  readonly getCheckboxDivProps: () => React.HTMLAttributes<HTMLDivElement>;
};

const errorSelector = {
  label: "ERROR: Not a boolean property",
  getContainerDivProps: () => ({}),
  getCheckboxDivProps: () => ({}),
  locked: false,
  checked: false,
};

export function useCheckboxPropertySelector({
  propertyName,
  propertyValueSet,
  valueItems,
  locked,
  onValueChange,
  showCodes,
  comparer,
}: UseCheckboxPropertySelectorOptions): UseCheckboxPropertySelector {
  const value = PropertyValueSet.getValue(propertyName, propertyValueSet);

  if (!valueItems || valueItems.length !== 2) {
    return errorSelector;
  }
  const falseValue = valueItems[0];
  const trueValue = valueItems[1];
  if (!falseValue.value || !trueValue.value) {
    return errorSelector;
  }

  const checked = PropertyValue.equals(trueValue.value, value, comparer);
  const nextValue = checked ? falseValue.value : trueValue.value;

  return {
    label: _getItemLabel(trueValue, showCodes),
    image: trueValue.image,
    locked,
    checked,
    getContainerDivProps: () => ({
      locked: locked,
      checked: checked,
      onClick: () => onValueChange(nextValue),
    }),
    getCheckboxDivProps: () => ({}),
  };
}

function _getItemLabel(valueItem: UseCheckboxPropertyValueItem, showCodes: boolean): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return valueItem.text + (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "");
}

export function getDefaultCheckboxStyle(selector: UseCheckboxPropertySelector): {} {
  return {
    marginTop: "6px",
    position: "relative",
    backgroundColor: "#ccc",
    width: "22px",
    height: "22px",
    background: selector.checked ? "red" : "green",
  };
}

export function getDefaultCheckboxContainerStyle(): {} {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  };
}

import React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { getSelectableOptions } from "../option";

export type UseComboboxPropertySelector = {
  readonly isSelectedItemValid: boolean;
  readonly locked: boolean;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly options: ReadonlyArray<UseComboboxPropertySelectorOption>;
};

export type UseComboboxPropertySelectorOptions = {
  readonly sortValidFirst: boolean;
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<UseComboBoxPropertyValueItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly comparer?: PropertyValue.Comparer;
};

export type UseComboboxPropertySelectorOption = {
  readonly label: string;
  readonly isItemValid: boolean;
  readonly getOptionProps: () => React.SelectHTMLAttributes<HTMLOptionElement>;
};

export type UseComboBoxPropertyValueItem = {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
};

export function useComboboxPropertySelector(
  hookOptions: UseComboboxPropertySelectorOptions
): UseComboboxPropertySelector {
  const { onValueChange, readOnly, locked } = hookOptions;

  const [selectedOption, selectableOptions] = getSelectableOptions(hookOptions);

  return {
    isSelectedItemValid: selectedOption.isItemValid,
    locked: locked,
    getSelectProps: () => ({
      disabled: readOnly || locked,
      value: selectedOption!.value,
      title: selectedOption!.toolTip,
      onChange: (event) => _doOnChange(event.currentTarget.value, onValueChange),
    }),
    options: selectableOptions.map((o) => ({
      label: o.label,
      isItemValid: o.isItemValid,
      getOptionProps: () => ({
        key: o.value,
        value: o.value,
        label: o.label,
        image: o.image,
        title: o.toolTip,
      }),
    })),
  };
}

export function getDefaultOptionStyle(o: UseComboboxPropertySelectorOption): {} {
  return {
    color: o.isItemValid ? "rgb(131, 131, 131)" : "red",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
  };
}

export function getDefaultSelectStyle(o: UseComboboxPropertySelector): {} {
  const always = {
    color: "black",
    height: "30px",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 30px 0px 10px",
  };

  if (!o.isSelectedItemValid && o.locked) {
    return {
      ...always,
      background: "lightgray",
      color: "red",
      border: "none",
    };
  } else if (!o.isSelectedItemValid) {
    return { ...always, color: "red" };
  } else if (o.locked) {
    return {
      ...always,
      background: "lightgray",
      color: "darkgray",
      border: "none",
    };
  }
  return { ...always };
}

function _doOnChange(
  newValue: string,
  onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void
): void {
  if (newValue === undefined || newValue === null) {
    onValueChange(undefined);
  } else {
    onValueChange(PropertyValue.create("integer", parseInt(newValue, 10)));
  }
}

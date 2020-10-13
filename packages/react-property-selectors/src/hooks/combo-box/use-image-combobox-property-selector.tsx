import React, { useState } from "react";
import {
  PropertyFilter,
  PropertyValue,
  PropertyValueSet
} from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { getOptions, getSelectedOption } from "./option";

export type UseImageComboboxPropertySelector = {
  readonly selected: {
    readonly tooltip: string;
    readonly label: string;
    readonly imageUrl?: string;
  };
  readonly setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly isOpen: boolean;
  readonly isSelectedItemValid: boolean;
  readonly locked: boolean;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly options: ReadonlyArray<UseImageComboboxPropertySelectorOption>;
};

export type UseImageComboboxPropertySelectorParams = {
  readonly sortValidFirst: boolean;
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<UseImageComboBoxPropertyValueItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly comparer?: PropertyValue.Comparer;
};

export type UseImageComboboxPropertySelectorOption = {
  //
  readonly value: string;
  readonly tooltip: string;
  readonly imageUrl?: string;
  //
  readonly label: string;
  readonly isItemValid: boolean;
  readonly getItemProps: () => React.LiHTMLAttributes<HTMLLIElement>;
};

export type UseImageComboBoxPropertyValueItem = {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
};

export function useImageComboboxPropertySelector(
  useComboboxPropertySelectorParams: UseImageComboboxPropertySelectorParams
): UseImageComboboxPropertySelector {
  const { onValueChange, readOnly, locked } = useComboboxPropertySelectorParams;

  const [isOpen, setIsOpen] = useState(false);

  const options = getOptions(useComboboxPropertySelectorParams);
  console.log("options", options);
  const selectedOption = getSelectedOption(
    useComboboxPropertySelectorParams,
    options
  );
  console.log("selectedOption", selectedOption);

  return {
    //
    selected: {
      tooltip: selectedOption.toolTip,
      label: selectedOption.label,
      imageUrl: selectedOption.image
    },
    setIsOpen,
    isOpen,
    //
    isSelectedItemValid: selectedOption.isItemValid,
    locked: locked,
    getSelectProps: () => ({
      disabled: readOnly || locked,
      value: selectedOption!.value,
      title: selectedOption!.toolTip,
      onChange: event => _doOnChange(event.currentTarget.value, onValueChange)
    }),
    options: options.map(o => ({
      //
      value: o.value,
      tooltip: o.toolTip,
      imageUrl: o.image,
      //
      label: o.label,
      isItemValid: o.isItemValid,
      getItemProps: () => ({
        key: o.value,
        value: o.value,
        label: o.label,
        image: o.image,
        title: o.toolTip,
        onClick: () => {
          // onChange(o.value);
          _doOnChange(o.value, onValueChange);
          setIsOpen(false);
        }
      })
    }))
  };
}

export function getDefaultImageOptionStyle(
  o: UseImageComboboxPropertySelectorOption
): {} {
  return {
    color: o.isItemValid ? "rgb(131, 131, 131)" : "red",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px"
  };
}

export function getDefaultImageSelectStyle(
  o: UseImageComboboxPropertySelector
): {} {
  const always = {
    color: "black",
    height: "30px",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 30px 0px 10px"
  };

  if (!o.isSelectedItemValid && o.locked) {
    return {
      ...always,
      background: "lightgray",
      color: "red",
      border: "none"
    };
  } else if (!o.isSelectedItemValid) {
    return { ...always, color: "red" };
  } else if (o.locked) {
    return {
      ...always,
      background: "lightgray",
      color: "darkgray",
      border: "none"
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

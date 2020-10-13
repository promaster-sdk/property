import React, { useState } from "react";
import {
  PropertyFilter,
  PropertyValue,
  PropertyValueSet
} from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { getOptions, getSelectedOption } from "./option";

export type UseImageComboboxPropertySelector = {
  readonly label: string;
  readonly imageUrl?: string;
  readonly isOpen: boolean;
  readonly isSelectedItemValid: boolean;
  readonly locked: boolean;
  readonly getToggleButtonProps: () => React.SelectHTMLAttributes<
    HTMLButtonElement
  >;
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
  readonly imageUrl?: string;
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
  const selectedOption = getSelectedOption(
    useComboboxPropertySelectorParams,
    options
  );

  return {
    label: selectedOption.label,
    imageUrl: selectedOption.image,
    isOpen,
    isSelectedItemValid: selectedOption.isItemValid,
    locked: locked,
    getToggleButtonProps: () => ({
      disabled: readOnly || locked,
      title: selectedOption !== undefined ? selectedOption.toolTip : undefined,
      onClick: () => setIsOpen(!isOpen)
    }),
    options: options.map(o => ({
      imageUrl: o.image,
      label: o.label,
      isItemValid: o.isItemValid,
      getItemProps: () => ({
        key: o.value,
        value: o.value,
        label: o.label,
        image: o.image,
        title: o.toolTip,
        onClick: () => {
          _doOnChange(o.value, onValueChange);
          setIsOpen(false);
        }
      })
    }))
  };
}

export function getDefaultToggleButtonStyle(
  selector: UseImageComboboxPropertySelector
): {} {
  return {
    width: "162px",
    alignItems: "center",
    background: "white",
    color: "black",
    height: "30px",
    whiteSpace: "nowrap",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 5px 0px 14px",
    textAlign: "right",

    ...buttonElementStyles({
      isSelectedItemValid: selector.isSelectedItemValid,
      locked: selector.locked
    })
  };
}

export function getDefaultMenuStyle(): {} {
  return {
    position: "absolute",
    display: "block",
    background: "white",
    border: "1px solid #bbb",
    listStyle: "none",
    margin: 0,
    padding: 0,
    zIndex: 100
  };
}

export function getDefaultListItemStyle(o: {
  readonly isItemValid: boolean;
}): {} {
  return {
    color: o.isItemValid === false ? "color: red" : "rgb(131, 131, 131)",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "0.2em 0.5em",
    cursor: "default"
  };
}

function buttonElementStyles({
  isSelectedItemValid,
  locked
}: {
  readonly isSelectedItemValid?: boolean;
  readonly locked: boolean;
}): {} {
  if (isSelectedItemValid === false && locked) {
    return {
      background: "lightgray",
      color: "red",
      border: "none"
    };
  } else if (isSelectedItemValid === false) {
    return { color: "red" };
  } else if (locked) {
    return {
      background: "lightgray",
      color: "darkgray",
      border: "none"
    };
  }

  return {};
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

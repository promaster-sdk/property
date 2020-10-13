import React from "react";
import {
  PropertyFilter,
  PropertyValue,
  PropertyValueSet
} from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
// import {
//   ImageDropdownSelector,
//   createImageDropdownSelector,
// } from "./image-dropdown-selector";

export type UseComboboxPropertySelector = {
  readonly isSelectedItemValid: boolean;
  readonly locked: boolean;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly options: ReadonlyArray<UseComboboxPropertySelectorOption>;
};

export type UseComboboxPropertySelectorParams = {
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
  useComboboxPropertySelectorParams: UseComboboxPropertySelectorParams
): UseComboboxPropertySelector {
  const { onValueChange, readOnly, locked } = useComboboxPropertySelectorParams;

  const options = getOptions(useComboboxPropertySelectorParams);
  const selectedOption = getSelectedOption(
    useComboboxPropertySelectorParams,
    options
  );

  return {
    isSelectedItemValid: selectedOption.isItemValid,
    locked: locked,
    getSelectProps: () => ({
      disabled: readOnly || locked,
      value: selectedOption!.value,
      title: selectedOption!.toolTip,
      onChange: event => _doOnChange(event.currentTarget.value, onValueChange)
    }),
    options: options.map(o => ({
      label: o.label,
      isItemValid: o.isItemValid,
      getOptionProps: () => ({
        key: o.value,
        value: o.value,
        label: o.label,
        image: o.image,
        title: o.toolTip
      })
    }))
  };
}

export function getDefaultOptionStyle(
  o: UseComboboxPropertySelectorOption
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

export function getDefaultSelectStyle(o: UseComboboxPropertySelector): {} {
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

type Option = {
  readonly value: string;
  readonly label: string;
  readonly isItemValid: boolean;
  readonly image: string | undefined;
  readonly toolTip: string;
};

function getSelectedOption(
  {
    propertyName,
    propertyValueSet,
    valueItems
  }: UseComboboxPropertySelectorParams,
  options: ReadonlyArray<Option>
): Option {
  if (!valueItems) {
    valueItems = [];
  }

  // Get selected option
  const value = PropertyValueSet.getInteger(propertyName, propertyValueSet);
  const selectedValueItemOrUndefined = valueItems.find(
    item => (item.value && PropertyValue.getInteger(item.value)) === value
  );
  let selectedValueItem: UseComboBoxPropertyValueItem;
  if (!selectedValueItemOrUndefined) {
    selectedValueItem = {
      value: undefined,
      sortNo: -1,
      text: value === undefined || value === null ? "" : value.toString(),
      validationFilter: PropertyFilter.Empty
    };
    // Add value items for selected value, even tough it does not really exist, but we need to show it in the combobox
    // valueItems.unshift(selectedValueItem);
    valueItems = [selectedValueItem, ...valueItems] as ReadonlyArray<
      UseComboBoxPropertyValueItem
    >;
  } else {
    selectedValueItem = selectedValueItemOrUndefined;
  }
  const selectedOption = options.find(
    option => option.value === _getItemValue(selectedValueItem)
  );
  if (!selectedOption) {
    throw new Error("Could not find..");
  }
  return selectedOption;
}

function getOptions({
  sortValidFirst,
  propertyName,
  propertyValueSet,
  valueItems,
  showCodes,
  filterPrettyPrint,
  comparer
}: UseComboboxPropertySelectorParams): ReadonlyArray<Option> {
  if (!valueItems) {
    valueItems = [];
  }

  // Convert value items to options
  const safeComparer = comparer || PropertyValue.defaultComparer;
  const options: Array<Option> = valueItems
    .map(valueItem => {
      const isItemValid = _isValueItemValid(
        propertyName,
        propertyValueSet,
        valueItem,
        safeComparer
      );
      return {
        value: _getItemValue(valueItem),
        label: _getItemLabel(valueItem, showCodes),
        isItemValid: isItemValid,
        image: valueItem.image,
        sortNo: valueItem.sortNo,
        toolTip: isItemValid
          ? ""
          : _getItemInvalidMessage(valueItem, filterPrettyPrint),
        getOptionProps: () => ({})
      };
    })
    .sort((a, b) => {
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
  return options;
}

function _getItemLabel(
  valueItem: UseComboBoxPropertyValueItem,
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

function _getItemValue(valueItem: UseComboBoxPropertyValueItem): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return PropertyValue.toString(valueItem.value);
}

function _getItemInvalidMessage(
  valueItem: UseComboBoxPropertyValueItem,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint
): string {
  return filterPrettyPrint(valueItem.validationFilter);
}

function _isValueItemValid(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItem: UseComboBoxPropertyValueItem,
  comparer: PropertyValue.Comparer
): boolean {
  if (valueItem.value === undefined || valueItem.value === null) {
    return true;
  }
  const pvsToCheck = PropertyValueSet.set(
    propertyName,
    valueItem.value,
    propertyValueSet
  );
  if (!valueItem.validationFilter) {
    return true;
  }
  return PropertyFilter.isValid(
    pvsToCheck,
    valueItem.validationFilter,
    comparer
  );
}

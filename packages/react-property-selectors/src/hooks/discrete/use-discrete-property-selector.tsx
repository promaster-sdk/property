import React, { useState } from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type DiscretePropertySelectorOptions = {
  readonly sortValidFirst: boolean;
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<DiscreteItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void;
  readonly disabled: boolean;
  readonly comparer?: PropertyValue.Comparer;
};

export type DiscreteItem = {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
};

export type DiscretePropertySelector = {
  readonly selectedItem: DiscreteItem;
  readonly disabled: boolean;
  readonly hasOptionImage: boolean;
  readonly isOpen: boolean;
  readonly imageUrl?: string;
  readonly items: ReadonlyArray<DiscreteItem>;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly getListItemProps: (item: DiscreteItem) => React.LiHTMLAttributes<HTMLLIElement>;
  readonly getItemLabel: (item: DiscreteItem) => string;
  readonly getItemToolTip: (item: DiscreteItem) => string;
  readonly getItemValue: (item: DiscreteItem) => string;
  readonly getOptionProps: (item: DiscreteItem) => React.SelectHTMLAttributes<HTMLOptionElement>;
  readonly getToggleButtonProps: () => React.SelectHTMLAttributes<HTMLButtonElement>;
  readonly isItemValid: (item: DiscreteItem) => boolean;
};

export function useDiscretePropertySelector(hookOptions: DiscretePropertySelectorOptions): DiscretePropertySelector {
  const {
    propertyValueSet,
    propertyName,
    onValueChange,
    disabled,
    comparer = PropertyValue.defaultComparer,
    filterPrettyPrint,
    showCodes,
    valueItems,
    sortValidFirst,
  } = hookOptions;

  const [selectedItem, selectableItems] = getSelectableItems(
    propertyName,
    propertyValueSet,
    valueItems,
    sortValidFirst,
    comparer
  );

  const [isOpen, setIsOpen] = useState(false);

  const getItemToolTip = (item: DiscreteItem): string => {
    const isItemValid = isValueItemValid(propertyName, propertyValueSet, item, comparer);
    return isItemValid ? "" : filterPrettyPrint(item.validationFilter);
  };

  return {
    selectedItem,
    disabled,
    hasOptionImage: selectableItems.some((o) => o.image !== undefined),
    getItemLabel: (item) => getItemLabel(item, showCodes),
    getItemValue: (item) => getItemValue(item),
    getItemToolTip,
    isOpen,
    isItemValid: (item) => isValueItemValid(propertyName, propertyValueSet, item, comparer),
    getToggleButtonProps: () => ({
      disabled,
      title: getItemToolTip(selectedItem),
      onClick: () => setIsOpen(!isOpen),
    }),
    getListItemProps: (item) => ({
      key: getItemValue(item),
      value: getItemValue(item),
      label: getItemLabel(item, showCodes),
      image: item.image,
      title: getItemToolTip(item),
      onClick: () => {
        _doOnChange(getItemValue(item), onValueChange);
        setIsOpen(false);
      },
    }),

    getSelectProps: () => ({
      disabled,
      value: getItemValue(selectedItem),
      title: getItemToolTip(selectedItem),
      onChange: (event) => {
        _doOnChange(event.currentTarget.value, onValueChange);
        setIsOpen(false);
      },
      // onChange: (event) => {
      //   const newValue = event.currentTarget.value;
      //   if (newValue === undefined || newValue === null) {
      //     onValueChange(undefined);
      //   } else {
      //     onValueChange(PropertyValue.create("integer", parseInt(newValue, 10)));
      //   }
      // },
    }),
    getOptionProps: (item) => {
      return {
        key: getItemValue(item),
        value: getItemValue(item),
        label: getItemLabel(item, showCodes),
        image: item.image,
        title: getItemToolTip(item),
      };
    },
    items: selectableItems,
  };
}

export function getSelectableItems(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItems: ReadonlyArray<DiscreteItem>,
  sortValidFirst: boolean,
  comparer: PropertyValue.Comparer
): [DiscreteItem, Array<DiscreteItem>] {
  // Convert value items to options
  let sortedItems = [...valueItems].sort((a, b) => {
    if (sortValidFirst) {
      const aValid = isValueItemValid(propertyName, propertyValueSet, a, comparer);
      const bValid = isValueItemValid(propertyName, propertyValueSet, b, comparer);
      if (aValid && !bValid) {
        return -1;
      }
      if (!aValid && bValid) {
        return 1;
      }
    }

    return a.sortNo - b.sortNo;
  });
  // Get selected item
  const value = PropertyValueSet.getInteger(propertyName, propertyValueSet);
  const selectedValueItemOrUndefined = valueItems.find(
    (item) => (item.value && PropertyValue.getInteger(item.value)) === value
  );
  let selectedValueItem: DiscreteItem;
  if (!selectedValueItemOrUndefined) {
    // Add item for selected value, even tough it does not really exist, but we need to show it in the combobox
    selectedValueItem = {
      value: undefined,
      sortNo: -1,
      text: value === undefined || value === null ? "" : value.toString(),
      validationFilter: PropertyFilter.Empty,
    };
    sortedItems = [selectedValueItem, ...sortedItems];
  } else {
    selectedValueItem = selectedValueItemOrUndefined;
  }
  return [selectedValueItem, sortedItems];
}

function getItemLabel(valueItem: DiscreteItem, showCodes: boolean): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }
  return valueItem.text + (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "");
}

function getItemValue(item: DiscreteItem): string {
  return item.value === undefined || item.value === null ? "" : PropertyValue.toString(item.value);
}

function isValueItemValid(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItem: DiscreteItem,
  comparer: PropertyValue.Comparer
): boolean {
  if (valueItem.value === undefined || valueItem.value === null) {
    return true;
  }
  const pvsToCheck = PropertyValueSet.set(propertyName, valueItem.value, propertyValueSet);
  if (!valueItem.validationFilter) {
    return true;
  }
  return PropertyFilter.isValid(pvsToCheck, valueItem.validationFilter, comparer);
}

export function getDefaultOptionStyle2(sel: DiscretePropertySelector, o: DiscreteItem): {} {
  return {
    color: sel.isItemValid(o) ? "rgb(131, 131, 131)" : "red",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
  };
}

export function getDefaultSelectStyle2(o: DiscretePropertySelector): {} {
  const always = {
    color: "black",
    height: "30px",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 30px 0px 10px",
  };

  const isSelectedItemValid = o.isItemValid(o.selectedItem);
  if (!isSelectedItemValid && o.disabled) {
    return {
      ...always,
      background: "lightgray",
      color: "red",
      border: "none",
    };
  } else if (!isSelectedItemValid) {
    return { ...always, color: "red" };
  } else if (o.disabled) {
    return {
      ...always,
      background: "lightgray",
      color: "darkgray",
      border: "none",
    };
  }
  return { ...always };
}

export function getDefaultToggleButtonStyle2(selector: DiscretePropertySelector): {} {
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

    ...buttonElementStyles2({
      isSelectedItemValid: selector.isItemValid(selector.selectedItem),
      locked: selector.disabled,
    }),
  };
}

export function getDefaultMenuStyle2(): {} {
  return {
    position: "absolute",
    display: "block",
    background: "white",
    border: "1px solid #bbb",
    listStyle: "none",
    margin: 0,
    padding: 0,
    zIndex: 100,
  };
}

export function getDefaultListItemStyle2(sel: DiscretePropertySelector, o: DiscreteItem): {} {
  return {
    color: sel.isItemValid(o) === false ? "color: red" : "rgb(131, 131, 131)",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "0.2em 0.5em",
    cursor: "default",
  };
}

function buttonElementStyles2({
  isSelectedItemValid,
  locked,
}: {
  readonly isSelectedItemValid?: boolean;
  readonly locked: boolean;
}): {} {
  if (isSelectedItemValid === false && locked) {
    return {
      background: "lightgray",
      color: "red",
      border: "none",
    };
  } else if (isSelectedItemValid === false) {
    return { color: "red" };
  } else if (locked) {
    return {
      background: "lightgray",
      color: "darkgray",
      border: "none",
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

import React from "react";
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
  readonly items: ReadonlyArray<DiscreteItem>;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly getItemLabel: (item: DiscreteItem) => string;
  readonly getItemToolTip: (item: DiscreteItem) => string;
  readonly getItemValue: (item: DiscreteItem) => string;
  readonly getOptionProps: (item: DiscreteItem) => React.SelectHTMLAttributes<HTMLOptionElement>;
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
  } = hookOptions;

  const [selectedItem, selectableItems] = getSelectableItems(hookOptions, comparer);

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
    isItemValid: (item) => isValueItemValid(propertyName, propertyValueSet, item, comparer),
    getSelectProps: () => ({
      disabled,
      value: getItemValue(selectedItem),
      // title: selectedItem.toolTip,
      onChange: (event) => {
        const newValue = event.currentTarget.value;
        if (newValue === undefined || newValue === null) {
          onValueChange(undefined);
        } else {
          onValueChange(PropertyValue.create("integer", parseInt(newValue, 10)));
        }
      },
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
    // items: selectableItems.map((o) => ({
    //   label: o.label,
    //   isItemValid: o.isItemValid,
    //   getOptionProps: () => ({
    //     key: o.value,
    //     value: o.value,
    //     label: o.label,
    //     image: o.image,
    //     title: o.toolTip,
    //   }),
    // })),
    items: selectableItems,
  };
}

// export type Option = {
//   readonly sortNo: number;
//   readonly value: string;
//   readonly label: string;
//   // readonly isItemValid: boolean;
//   readonly image: string | undefined;
//   readonly toolTip: string;
// };

export type GetOptionsParams = {
  readonly sortValidFirst: boolean;
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<DiscreteItem>;
};

export function getSelectableItems(
  { sortValidFirst, propertyName, propertyValueSet, valueItems }: GetOptionsParams,
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

// function makeOption(
//   valueItem: GetOptionsParamsValueItem,
//   propertyName: string,
//   propertyValueSet: PropertyValueSet.PropertyValueSet,
//   safeComparer: PropertyValue.Comparer,
//   showCodes: boolean,
//   filterPrettyPrint: PropertyFiltering.FilterPrettyPrint
// ): Option {
//   const isItemValid = isValueItemValid(propertyName, propertyValueSet, valueItem, safeComparer);
//   return {
//     value: _getItemValue(valueItem),
//     label: _getItemLabel(valueItem, showCodes),
//     isItemValid: isItemValid,
//     image: valueItem.image,
//     sortNo: valueItem.sortNo,
//     toolTip: isItemValid ? "" : filterPrettyPrint(valueItem.validationFilter),
//   };
// }

function getItemLabel(valueItem: DiscreteItem, showCodes: boolean): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }
  return valueItem.text + (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "");
}

function getItemValue(item: DiscreteItem): string {
  // console.log("getting value for item", item);
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

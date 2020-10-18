import React, { useState } from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type ItemComparer<TItem> = (a: TItem, b: TItem) => number;
export type GetItemValue<TItem> = (item: TItem) => ItemValue;
export type GetItemFilter<TItem> = (item: TItem) => PropertyFilter.PropertyFilter;
export type ItemValue = PropertyValue.PropertyValue | undefined | null;

export type DiscretePropertySelectorOptions<TItem> = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly items: ReadonlyArray<TItem>;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void;
  // Get an item that corresponds to a property value of undefined
  readonly getUndefinedValueItem: () => TItem;
  readonly getItemValue: GetItemValue<TItem>;
  readonly getItemFilter: GetItemFilter<TItem>;
  readonly filterPrettyPrint?: PropertyFiltering.FilterPrettyPrint;
  readonly sortValidFirst?: boolean;
  readonly trueItemIndex?: number;
  readonly falseItemIndex?: number;
  readonly showCodes?: boolean;
  readonly disabled?: boolean;
  readonly valueComparer?: PropertyValue.Comparer;
  readonly itemComparer?: ItemComparer<TItem>;
};

export type DiscretePropertySelector<TItem> = {
  readonly selectedItem: TItem;
  readonly disabled: boolean;
  readonly isOpen: boolean;
  readonly items: ReadonlyArray<TItem>;
  readonly isTrueItem: boolean;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly getToggleButtonProps: () => React.SelectHTMLAttributes<HTMLButtonElement>;
  readonly getListItemProps: (item: TItem) => React.LiHTMLAttributes<HTMLLIElement>;
  readonly getItemLabel: (text: string, item: TItem) => string;
  readonly getItemToolTip: (item: TItem) => string;
  readonly getItemValue: (item: TItem) => string;
  readonly getOptionProps: (item: TItem) => React.SelectHTMLAttributes<HTMLOptionElement>;
  readonly getRadioItemProps: (item: TItem) => React.HTMLAttributes<HTMLDivElement>;
  readonly getCheckboxDivProps: () => React.HTMLAttributes<HTMLDivElement>;
  readonly isItemValid: (item: TItem) => boolean;
};

export function useDiscretePropertySelector<TItem>(
  hookOptionsLoose: DiscretePropertySelectorOptions<TItem>
): DiscretePropertySelector<TItem> {
  const hookOptions: Required<DiscretePropertySelectorOptions<TItem>> = fillOptionsWithDefualts(hookOptionsLoose);

  const {
    propertyValueSet,
    propertyName,
    onValueChange,
    disabled,
    valueComparer,
    showCodes,
    items,
    sortValidFirst,
    falseItemIndex,
    trueItemIndex,
    getUndefinedValueItem,
    itemComparer,
    getItemValue,
    getItemFilter,
  } = hookOptions;

  const [selectedItem, selectableItems] = getSelectableItems<TItem>(
    propertyName,
    propertyValueSet,
    items,
    getUndefinedValueItem,
    sortValidFirst,
    valueComparer,
    itemComparer,
    getItemValue,
    getItemFilter
  );

  const [isOpen, setIsOpen] = useState(false);

  const falseItem = items[falseItemIndex];
  const trueItem = items[trueItemIndex];
  const isTrueItem = selectedItem === trueItem;

  return {
    selectedItem,
    disabled,
    getItemLabel: (text, item) => getItemLabel(text, getItemValue(item), showCodes),
    getItemValue: (item) => getItemValueAsString(getItemValue(item)),
    getItemToolTip: (item) => getItemToolTip(hookOptions, getItemFilter(item), getItemValue(item)),
    isOpen,
    isTrueItem,
    isItemValid: (item) =>
      isValueItemValid(propertyName, propertyValueSet, getItemFilter(item), getItemValue(item), valueComparer),
    getToggleButtonProps: () => ({
      disabled,
      title: getItemToolTip(hookOptions, getItemFilter(selectedItem), getItemValue(selectedItem)),
      onClick: () => setIsOpen(!isOpen),
    }),
    getListItemProps: (item) => {
      const itemValue = getItemValue(item);
      const itemFilter = getItemFilter(item);
      return {
        key: getItemValueAsString(itemValue),
        value: getItemValueAsString(itemValue),
        // label: getItemLabel(item, itemValue, showCodes),
        title: getItemToolTip(hookOptions, itemFilter, itemValue),
        onClick: () => {
          _doOnChange(getItemValueAsString(itemValue), onValueChange);
          setIsOpen(false);
        },
      };
    },
    getSelectProps: () => {
      const itemValue = getItemValue(selectedItem);
      const itemFilter = getItemFilter(selectedItem);
      return {
        disabled,
        value: getItemValueAsString(itemValue),
        title: getItemToolTip(hookOptions, itemFilter, itemValue),
        onChange: (event) => {
          _doOnChange(event.currentTarget.value, onValueChange);
          setIsOpen(false);
        },
      };
    },
    getOptionProps: (item) => {
      const itemValue = getItemValue(item);
      const itemFilter = getItemFilter(item);
      return {
        key: getItemValueAsString(itemValue),
        value: getItemValueAsString(itemValue),
        // label: getItemLabel(item, itemValue, showCodes),
        title: getItemToolTip(hookOptions, itemFilter, itemValue),
      };
    },
    getRadioItemProps: (item) => {
      const itemValue = getItemValue(item);
      return {
        key: getItemValueAsString(itemValue),
        onClick: () => _doOnChange(getItemValueAsString(itemValue), onValueChange),
      };
    },
    getCheckboxDivProps: () => ({
      onClick: () => onValueChange(isTrueItem ? getItemValue(falseItem)!! : getItemValue(trueItem)!!),
    }),

    items: selectableItems,
  };
}

function getSelectableItems<TItem>(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  items: ReadonlyArray<TItem>,
  getUndefinedValueItem: () => TItem,
  sortValidFirst: boolean,
  valueComparer: PropertyValue.Comparer,
  itemComparer: ItemComparer<TItem>,
  getItemValue: GetItemValue<TItem>,
  getItemFilter: GetItemFilter<TItem>
): [TItem, Array<TItem>] {
  // Convert value items to options
  let sortedItems = [...items].sort((a, b) => {
    if (sortValidFirst) {
      const aValid = isValueItemValid(propertyName, propertyValueSet, getItemFilter(a), getItemValue(a), valueComparer);
      const bValid = isValueItemValid(propertyName, propertyValueSet, getItemFilter(b), getItemValue(b), valueComparer);
      if (aValid && !bValid) {
        return -1;
      }
      if (!aValid && bValid) {
        return 1;
      }
    }

    // return a.sortNo - b.sortNo;
    return itemComparer(a, b);
  });
  // Get selected item
  const value = PropertyValueSet.getInteger(propertyName, propertyValueSet);
  const selectedValueItemOrUndefined = items.find((item) => {
    const itemValue = getItemValue(item);
    return (itemValue && PropertyValue.getInteger(itemValue)) === value;
  });
  let selectedValueItem: TItem;
  if (!selectedValueItemOrUndefined) {
    // Add item for selected value, even tough it does not really exist, but we need to show it in the combobox
    selectedValueItem = getUndefinedValueItem();
    sortedItems = [selectedValueItem, ...sortedItems];
  } else {
    selectedValueItem = selectedValueItemOrUndefined;
  }
  return [selectedValueItem, sortedItems];
}

function getItemToolTip<TItem>(
  options: Required<DiscretePropertySelectorOptions<TItem>>,
  itemFilter: PropertyFilter.PropertyFilter,
  itemValue: ItemValue
): string {
  const isItemValid = isValueItemValid(
    options.propertyName,
    options.propertyValueSet,
    itemFilter,
    itemValue,
    options.valueComparer
  );
  return isItemValid ? "" : options.filterPrettyPrint(itemFilter);
}

function getItemLabel(itemText: string, itemValue: ItemValue, showCodes: boolean): string {
  if (itemValue === undefined || itemValue === null) {
    return "";
  }
  return itemText + (showCodes ? ` (${PropertyValue.toString(itemValue)}) ` : "");
}

function getItemValueAsString(itemValue: ItemValue): string {
  return itemValue === undefined || itemValue === null ? "" : PropertyValue.toString(itemValue);
}

function isValueItemValid(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  itemFilter: PropertyFilter.PropertyFilter,
  itemValue: ItemValue,
  comparer: PropertyValue.Comparer
): boolean {
  if (itemValue === undefined || itemValue === null) {
    return true;
  }
  const pvsToCheck = PropertyValueSet.set(propertyName, itemValue, propertyValueSet);
  if (!itemFilter) {
    return true;
  }
  return PropertyFilter.isValid(pvsToCheck, itemFilter, comparer);
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

function fillOptionsWithDefualts<TItem>(
  options: DiscretePropertySelectorOptions<TItem>
): Required<DiscretePropertySelectorOptions<TItem>> {
  return {
    ...options,
    sortValidFirst: options.sortValidFirst || false,
    showCodes: options.showCodes || false,
    disabled: options.disabled || false,
    filterPrettyPrint: options.filterPrettyPrint || ((f) => PropertyFilter.toString(f)),
    valueComparer: options.valueComparer || PropertyValue.defaultComparer,
    falseItemIndex: options.falseItemIndex || 0,
    trueItemIndex: options.trueItemIndex || 1,
    itemComparer: () => 0,
  };
}

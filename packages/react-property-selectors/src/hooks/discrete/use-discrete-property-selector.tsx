import React, { useState } from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type ItemComparer<TItem> = (a: TItem, b: TItem) => number;
export type GetItemValue<TItem> = (item: TItem) => PropertyValue.PropertyValue | undefined | null;

export type DiscretePropertySelectorOptions<TItem extends DiscreteItem> = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<TItem>;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void;
  // Get an item that corresponds to a property value of undefined
  readonly getUndefinedValueItem: () => TItem;
  readonly getItemValue: GetItemValue<TItem>;
  readonly filterPrettyPrint?: PropertyFiltering.FilterPrettyPrint;
  readonly sortValidFirst?: boolean;
  readonly trueItemIndex?: number;
  readonly falseItemIndex?: number;
  readonly showCodes?: boolean;
  readonly disabled?: boolean;
  readonly valueComparer?: PropertyValue.Comparer;
  readonly itemComparer?: ItemComparer<TItem>;
};

export type DiscreteItem = {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly text: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
};

export type DiscretePropertySelector<TItem extends DiscreteItem> = {
  readonly selectedItem: TItem;
  readonly disabled: boolean;
  // readonly hasOptionImage: boolean;
  readonly isOpen: boolean;
  readonly items: ReadonlyArray<TItem>;
  readonly isTrueItem: boolean;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly getToggleButtonProps: () => React.SelectHTMLAttributes<HTMLButtonElement>;
  readonly getListItemProps: (item: TItem) => React.LiHTMLAttributes<HTMLLIElement>;
  readonly getItemLabel: (item: TItem) => string;
  readonly getItemToolTip: (item: TItem) => string;
  readonly getItemValue: (item: TItem) => string;
  readonly getOptionProps: (item: TItem) => React.SelectHTMLAttributes<HTMLOptionElement>;
  readonly getRadioItemProps: (item: TItem) => React.HTMLAttributes<HTMLDivElement>;
  readonly getCheckboxDivProps: () => React.HTMLAttributes<HTMLDivElement>;
  readonly isItemValid: (item: TItem) => boolean;
};

export function useDiscretePropertySelector<TItem extends DiscreteItem>(
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
    valueItems,
    sortValidFirst,
    falseItemIndex,
    trueItemIndex,
    getUndefinedValueItem,
    itemComparer,
  } = hookOptions;

  const [selectedItem, selectableItems] = getSelectableItems<TItem>(
    propertyName,
    propertyValueSet,
    valueItems,
    getUndefinedValueItem,
    sortValidFirst,
    valueComparer,
    itemComparer
  );

  const [isOpen, setIsOpen] = useState(false);

  const falseItem = valueItems[falseItemIndex];
  const trueItem = valueItems[trueItemIndex];
  const isTrueItem = selectedItem === trueItem;

  return {
    selectedItem,
    disabled,
    // hasOptionImage: selectableItems.some((o) => o.image !== undefined),
    getItemLabel: (item) => getItemLabel(item, showCodes),
    getItemValue: (item) => getItemValue(item),
    getItemToolTip: (item) => getItemToolTip(hookOptions, item),
    isOpen,
    isTrueItem,
    isItemValid: (item) => isValueItemValid(propertyName, propertyValueSet, item, valueComparer),
    getToggleButtonProps: () => ({
      disabled,
      title: getItemToolTip(hookOptions, selectedItem),
      onClick: () => setIsOpen(!isOpen),
    }),
    getListItemProps: (item) => ({
      key: getItemValue(item),
      value: getItemValue(item),
      label: getItemLabel(item, showCodes),
      // image: item.image,
      title: getItemToolTip(hookOptions, item),
      onClick: () => {
        _doOnChange(getItemValue(item), onValueChange);
        setIsOpen(false);
      },
    }),
    getSelectProps: () => ({
      disabled,
      value: getItemValue(selectedItem),
      title: getItemToolTip(hookOptions, selectedItem),
      onChange: (event) => {
        _doOnChange(event.currentTarget.value, onValueChange);
        setIsOpen(false);
      },
    }),
    getOptionProps: (item) => {
      return {
        key: getItemValue(item),
        value: getItemValue(item),
        label: getItemLabel(item, showCodes),
        // image: item.image,
        title: getItemToolTip(hookOptions, item),
      };
    },
    getRadioItemProps: (item) => ({
      key: getItemValue(item),
      onClick: () => _doOnChange(getItemValue(item), onValueChange),
    }),
    getCheckboxDivProps: () => ({
      onClick: () => onValueChange(isTrueItem ? falseItem.value!! : trueItem.value!!),
    }),

    items: selectableItems,
  };
}

function getSelectableItems<TItem extends DiscreteItem>(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItems: ReadonlyArray<TItem>,
  getUndefinedValueItem: () => TItem,
  sortValidFirst: boolean,
  valueComparer: PropertyValue.Comparer,
  itemComparer: ItemComparer<TItem>
): [TItem, Array<TItem>] {
  // Convert value items to options
  let sortedItems = [...valueItems].sort((a, b) => {
    if (sortValidFirst) {
      const aValid = isValueItemValid(propertyName, propertyValueSet, a, valueComparer);
      const bValid = isValueItemValid(propertyName, propertyValueSet, b, valueComparer);
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
  const selectedValueItemOrUndefined = valueItems.find(
    (item) => (item.value && PropertyValue.getInteger(item.value)) === value
  );
  let selectedValueItem: TItem;
  if (!selectedValueItemOrUndefined) {
    // Add item for selected value, even tough it does not really exist, but we need to show it in the combobox
    // selectedValueItem = {
    //   value: undefined,
    //   sortNo: -1,
    //   text: value === undefined || value === null ? "" : value.toString(),
    //   validationFilter: PropertyFilter.Empty,
    // };
    selectedValueItem = getUndefinedValueItem();
    sortedItems = [selectedValueItem, ...sortedItems];
  } else {
    selectedValueItem = selectedValueItemOrUndefined;
  }
  return [selectedValueItem, sortedItems];
}

function getItemToolTip<TItem extends DiscreteItem>(
  options: Required<DiscretePropertySelectorOptions<TItem>>,
  item: TItem
): string {
  const isItemValid = isValueItemValid(options.propertyName, options.propertyValueSet, item, options.valueComparer);
  return isItemValid ? "" : options.filterPrettyPrint(item.validationFilter);
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

function fillOptionsWithDefualts<TItem extends DiscreteItem>(
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

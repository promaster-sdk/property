import React, { useState } from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type DiscretePropertySelectorOptions<TItem extends DiscreteItem = DiscreteItem> = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<TItem>;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void;
  // Get an item that corresponds to a property value of undefined
  readonly getUndefinedValueItem: () => TItem;
  readonly filterPrettyPrint?: PropertyFiltering.FilterPrettyPrint;
  readonly sortValidFirst?: boolean;
  readonly trueItemIndex?: number;
  readonly falseItemIndex?: number;
  readonly showCodes?: boolean;
  readonly disabled?: boolean;
  readonly comparer?: PropertyValue.Comparer;
};

export type DiscreteItem = {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
};

export type DiscretePropertySelector<TItem extends DiscreteItem = DiscreteItem> = {
  readonly selectedItem: TItem;
  readonly disabled: boolean;
  readonly hasOptionImage: boolean;
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

export function useDiscretePropertySelector<TItem extends DiscreteItem = DiscreteItem>(
  hookOptionsLoose: DiscretePropertySelectorOptions<TItem>
): DiscretePropertySelector {
  const hookOptions: Required<DiscretePropertySelectorOptions<TItem>> = fillOptionsWithDefualts(hookOptionsLoose);

  const {
    propertyValueSet,
    propertyName,
    onValueChange,
    disabled,
    comparer,
    showCodes,
    valueItems,
    sortValidFirst,
    falseItemIndex,
    trueItemIndex,
    getUndefinedValueItem,
  } = hookOptions;

  const [selectedItem, selectableItems] = getSelectableItems<TItem>(
    propertyName,
    propertyValueSet,
    valueItems,
    getUndefinedValueItem,
    sortValidFirst,
    comparer
  );

  const [isOpen, setIsOpen] = useState(false);

  const falseItem = valueItems[falseItemIndex];
  const trueItem = valueItems[trueItemIndex];
  const isTrueItem = selectedItem === trueItem;

  return {
    selectedItem,
    disabled,
    hasOptionImage: selectableItems.some((o) => o.image !== undefined),
    getItemLabel: (item) => getItemLabel(item, showCodes),
    getItemValue: (item) => getItemValue(item),
    getItemToolTip: (item) => getItemToolTip(hookOptions, item),
    isOpen,
    isTrueItem,
    isItemValid: (item) => isValueItemValid(propertyName, propertyValueSet, item, comparer),
    getToggleButtonProps: () => ({
      disabled,
      title: getItemToolTip(hookOptions, selectedItem),
      onClick: () => setIsOpen(!isOpen),
    }),
    getListItemProps: (item) => ({
      key: getItemValue(item),
      value: getItemValue(item),
      label: getItemLabel(item, showCodes),
      image: item.image,
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
        image: item.image,
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

function getSelectableItems<TItem extends DiscreteItem = DiscreteItem>(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItems: ReadonlyArray<TItem>,
  getUndefinedValueItem: () => TItem,
  sortValidFirst: boolean,
  comparer: PropertyValue.Comparer
): [TItem, Array<TItem>] {
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

function getItemToolTip(options: Required<DiscretePropertySelectorOptions>, item: DiscreteItem): string {
  const isItemValid = isValueItemValid(options.propertyName, options.propertyValueSet, item, options.comparer);
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
    comparer: options.comparer || PropertyValue.defaultComparer,
    falseItemIndex: options.falseItemIndex || 0,
    trueItemIndex: options.trueItemIndex || 1,
  };
}

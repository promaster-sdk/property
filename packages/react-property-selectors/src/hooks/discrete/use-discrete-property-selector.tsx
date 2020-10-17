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
  readonly items: ReadonlyArray<DiscreteItem>;
  readonly getSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly getToggleButtonProps: () => React.SelectHTMLAttributes<HTMLButtonElement>;
  readonly getListItemProps: (item: DiscreteItem) => React.LiHTMLAttributes<HTMLLIElement>;
  readonly getItemLabel: (item: DiscreteItem) => string;
  readonly getItemToolTip: (item: DiscreteItem) => string;
  readonly getItemValue: (item: DiscreteItem) => string;
  readonly getOptionProps: (item: DiscreteItem) => React.SelectHTMLAttributes<HTMLOptionElement>;
  readonly getRadioItemProps: (item: DiscreteItem) => React.HTMLAttributes<HTMLDivElement>;
  readonly isItemValid: (item: DiscreteItem) => boolean;
};

export function useDiscretePropertySelector(
  hookOptionsLoose: DiscretePropertySelectorOptions
): DiscretePropertySelector {
  const hookOptions: Required<DiscretePropertySelectorOptions> = fillOptionsWithDefualts(hookOptionsLoose);

  const {
    propertyValueSet,
    propertyName,
    onValueChange,
    disabled,
    comparer,
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

  return {
    selectedItem,
    disabled,
    hasOptionImage: selectableItems.some((o) => o.image !== undefined),
    getItemLabel: (item) => getItemLabel(item, showCodes),
    getItemValue: (item) => getItemValue(item),
    getItemToolTip: (item) => getItemToolTip(hookOptions, item),
    isOpen,
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
    items: selectableItems,
  };
}

function getSelectableItems(
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

function fillOptionsWithDefualts(options: DiscretePropertySelectorOptions): Required<DiscretePropertySelectorOptions> {
  return { ...options, comparer: options.comparer || PropertyValue.defaultComparer };
}

import React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type UseCheckboxPropertySelectorOptions = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<UseCheckboxPropertyValueItem>;
  readonly trueItemIndex?: number;
  readonly falseItemIndex?: number;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly comparer?: PropertyValue.Comparer;
};

export interface UseCheckboxPropertyValueItem {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
}

export type UseCheckboxPropertySelector = {
  readonly label: string;
  readonly image?: string;
  readonly isTrueItem: boolean;
  readonly getCheckboxDivProps: () => React.HTMLAttributes<HTMLDivElement>;
};

export function useCheckboxPropertySelector({
  propertyName,
  propertyValueSet,
  valueItems,
  onValueChange,
  showCodes,
  comparer,
  falseItemIndex,
  trueItemIndex,
}: UseCheckboxPropertySelectorOptions): UseCheckboxPropertySelector {
  const value = PropertyValueSet.getValue(propertyName, propertyValueSet);

  const safeFalseItemIndex = falseItemIndex || 0;
  const safeTrueItemIndex = trueItemIndex || 1;
  const falseValue = valueItems[safeFalseItemIndex];
  const trueValue = valueItems[safeTrueItemIndex];

  const isTrueItem = (trueValue.value && PropertyValue.equals(trueValue.value, value, comparer)) || false;
  const nextValue = isTrueItem ? falseValue.value!! : trueValue.value!!;

  return {
    label: _getItemLabel(trueValue, showCodes),
    image: trueValue.image,
    isTrueItem,
    getCheckboxDivProps: () => ({
      onClick: () => onValueChange(nextValue),
    }),
  };
}

function _getItemLabel(valueItem: UseCheckboxPropertyValueItem, showCodes: boolean): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return valueItem.text + (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "");
}

export function getDefaultCheckboxStyle(selector: UseCheckboxPropertySelector): {} {
  return {
    marginTop: "6px",
    position: "relative",
    backgroundColor: "#ccc",
    width: "22px",
    height: "22px",
    background: selector.isTrueItem ? "red" : "green",
  };
}

export function getDefaultCheckboxContainerStyle(): {} {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  };
}

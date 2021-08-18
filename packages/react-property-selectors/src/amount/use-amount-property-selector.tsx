import { useCallback } from "react";
import { PropertyValueSet, PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { Amount } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  UseAmountFormatSelectorHook,
  useAmountFormatSelector,
  UseAmountFormatSelectorOnFormatChanged,
  UseAmountFormatSelectorOnFormatCleared,
  GetSelectableFormats,
  UnitLabels,
} from "./use-amount-format-selector";
import { UseAmountInputBox, useAmountInputBox } from "./use-amount-input-box";

export type UseAmountPropertySelectorOptions = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly notNumericMessage: string;
  readonly isRequiredMessage: string;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly readOnly: boolean;
  readonly onFormatChanged: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared: UseAmountFormatSelectorOnFormatCleared;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void;
  readonly debounceTime?: number;
  readonly comparer?: PropertyValue.Comparer;
  readonly getSelectableFormats: GetSelectableFormats;
  readonly unitLabels: UnitLabels;
};

export type AmountPropertySelector = {
  readonly amountInputBox: UseAmountInputBox;
  readonly amountFormatSelector: UseAmountFormatSelectorHook;
};

export function useAmountPropertySelector(options: UseAmountPropertySelectorOptions): AmountPropertySelector {
  const {
    onValueChange,
    onFormatChanged,
    onFormatCleared,
    notNumericMessage,
    isRequiredMessage,
    validationFilter,
    propertyValueSet,
    propertyName,
    filterPrettyPrint,
    readOnly,
    debounceTime = 350,
    getSelectableFormats,
    comparer = PropertyValue.defaultComparer,
    unitLabels,
  } = options;

  const value: Amount.Amount<unknown> | undefined = PropertyValueSet.getAmount(propertyName, propertyValueSet);

  const errorMessage = getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint, comparer);

  const onValueChangeCallback = useCallback(
    (newAmount) => onValueChange(newAmount !== undefined ? PropertyValue.create("amount", newAmount) : undefined),
    [onValueChange]
  );

  const selectedFormat = getSelectableFormats().current;

  const amountInputBox = useAmountInputBox({
    value,
    inputUnit: selectedFormat.unit,
    inputDecimalCount: selectedFormat.decimalCount,
    notNumericMessage,
    isRequiredMessage,
    readOnly,
    debounceTime,
    errorMessage,
    onValueChange: onValueChangeCallback,
  });

  const amountFormatSelector = useAmountFormatSelector({
    onFormatChanged,
    onFormatCleared,
    getSelectableFormats: getSelectableFormats,
    unitLabels,
  });

  return { amountInputBox, amountFormatSelector };
}

function getValidationMessage(
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  value: Amount.Amount<unknown> | undefined,
  validationFilter: PropertyFilter.PropertyFilter,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
  comparer: PropertyValue.Comparer
): string {
  if (!value || !validationFilter) {
    return "";
  }

  if (PropertyFilter.isValid(propertyValueSet, validationFilter, comparer)) {
    return "";
  } else {
    return filterPrettyPrint(validationFilter);
  }
}

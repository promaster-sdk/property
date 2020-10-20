import { useCallback } from "react";
import { PropertyValueSet, PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { Amount, Unit, UnitFormat } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  UseAmountFormatSelector,
  useAmountFormatSelector,
  UseAmountFormatSelectorOnFormatChanged,
  UseAmountFormatSelectorOnFormatCleared,
} from "./use-amount-format-selector";
import { UseAmountInputBox, useAmountInputBox } from "./use-amount-input-box";

export type UseAmountPropertySelectorOptions = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly inputUnit: Unit.Unit<unknown>;
  readonly inputDecimalCount: number;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly notNumericMessage: string;
  readonly isRequiredMessage: string;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly readOnly: boolean;
  readonly onFormatChanged: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared: UseAmountFormatSelectorOnFormatCleared;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void;
  readonly debounceTime?: number;
  readonly fieldName: string;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  readonly units: {
    readonly [key: string]: Unit.Unit<unknown>;
  };
  readonly comparer?: PropertyValue.Comparer;
};

export type UseAmountPropertySelector = {
  readonly amountInputBox: UseAmountInputBox;
  readonly amountFormatSelector: UseAmountFormatSelector;
};

export function useAmountPropertySelector(options: UseAmountPropertySelectorOptions): UseAmountPropertySelector {
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
    inputUnit,
    inputDecimalCount,
    readOnly,
    debounceTime = 350,
    unitsFormat,
    units,
    comparer = PropertyValue.defaultComparer,
  } = options;

  const value: Amount.Amount<unknown> | undefined = PropertyValueSet.getAmount(propertyName, propertyValueSet);

  const errorMessage = getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint, comparer);

  const onValueChangeCallback = useCallback(
    (newAmount) => onValueChange(newAmount !== undefined ? PropertyValue.create("amount", newAmount) : undefined),
    [onValueChange]
  );

  const amountInputBox = useAmountInputBox({
    value,
    inputUnit,
    inputDecimalCount,
    notNumericMessage,
    isRequiredMessage,
    readOnly,
    debounceTime,
    errorMessage,
    onValueChange: onValueChangeCallback,
  });
  const amountFormatSelector = useAmountFormatSelector({
    selectedUnit: inputUnit,
    selectedDecimalCount: inputDecimalCount,
    onFormatChanged,
    onFormatCleared,
    unitsFormat,
    units,
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

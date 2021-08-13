import { useCallback } from "react";
import { PropertyValueSet, PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { Amount } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  UseAmountFormatSelectorHook,
  useAmountFormatSelector,
  UseAmountFormatSelectorOnFormatChanged,
  UseAmountFormatSelectorOnFormatCleared,
  GetSelectableUnits,
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

  // readonly inputUnit: Unit.Unit<unknown>;
  // readonly inputDecimalCount: number;
  // readonly unitsFormat: UnitFormat.UnitFormatMap;
  // readonly units: UnitMap.UnitMap;

  readonly getSelectableUnits: GetSelectableUnits;
  readonly selectedUnitIndex: number;
  readonly selectedDecimalCountIndex: number;
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
    getSelectableUnits,
    selectedUnitIndex,
    selectedDecimalCountIndex,
    comparer = PropertyValue.defaultComparer,
  } = options;

  const value: Amount.Amount<unknown> | undefined = PropertyValueSet.getAmount(propertyName, propertyValueSet);

  const errorMessage = getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint, comparer);

  const onValueChangeCallback = useCallback(
    (newAmount) => onValueChange(newAmount !== undefined ? PropertyValue.create("amount", newAmount) : undefined),
    [onValueChange]
  );

  const selectableUnits = getSelectableUnits();
  const selectedUnit = selectableUnits[selectedUnitIndex];

  const amountInputBox = useAmountInputBox({
    value,
    inputUnit: selectedUnit.unit,
    inputDecimalCount: selectedUnit.selectableDecimalCounts[selectedDecimalCountIndex],
    notNumericMessage,
    isRequiredMessage,
    readOnly,
    debounceTime,
    errorMessage,
    onValueChange: onValueChangeCallback,
  });
  const amountFormatSelector = useAmountFormatSelector({
    // selectedUnit: inputUnit,
    // selectedDecimalCount: inputDecimalCount,
    selectedUnitIndex,
    selectedDecimalCountIndex,
    onFormatChanged,
    onFormatCleared,
    getSelectableUnits,
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

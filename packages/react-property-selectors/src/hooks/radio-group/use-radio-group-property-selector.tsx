import { PropertyValue, PropertyValueSet, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type UseRadioGroupPropertySelectorOptions = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<HookRadioGroupPropertyValueItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly comparer?: PropertyValue.Comparer;
};

export type HookRadioGroupPropertyValueItem = {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
};

export type UseRadioGroupPropertySelector = {
  readonly isLocked: boolean;
  readonly getGroupProps: () => React.HTMLAttributes<HTMLDivElement>;
  readonly items: ReadonlyArray<RadioGroupItemInfo>;
};

export type RadioGroupItemInfo = {
  readonly getItemProps: () => React.HTMLAttributes<HTMLDivElement>;
  readonly sortNo: number;
  readonly selected: boolean;
  readonly label: string;
  readonly imageUrl: string | undefined;
  readonly toolTip: string;
  // readonly onClick: () => void;
  readonly isItemValid: boolean;
};

export function useRadioGroupPropertySelector({
  propertyName,
  propertyValueSet,
  valueItems,
  showCodes,
  onValueChange,
  filterPrettyPrint,
  readOnly,
  locked,
  comparer,
}: UseRadioGroupPropertySelectorOptions): UseRadioGroupPropertySelector {
  const value = PropertyValueSet.getValue(propertyName, propertyValueSet);

  const safeComparer = comparer || PropertyValue.defaultComparer;

  if (!valueItems) {
    valueItems = [];
  }

  // Convert value items to options
  const items: Array<RadioGroupItemInfo> = valueItems
    .map((valueItem) => {
      const isItemValid = _isValueItemValid(propertyName, propertyValueSet, valueItem, safeComparer);
      return {
        getItemProps: () => ({
          key: valueItem.sortNo.toString(),
          onClick: () => !readOnly && valueItem.value && onValueChange(valueItem.value),
        }),
        sortNo: valueItem.sortNo,
        selected: valueItem.value ? PropertyValue.equals(value, valueItem.value, safeComparer) : false,
        label: _getItemLabel(valueItem, showCodes),
        imageUrl: valueItem.image,
        toolTip: isItemValid ? "" : _getItemInvalidMessage(valueItem, filterPrettyPrint),
        isItemValid: isItemValid,
      };
    })
    .sort((a, b) => a.sortNo - b.sortNo);

  // return (
  //   <RadioGroup locked={locked}>
  //     {items.map((item) => (
  //       <RadioGroupItem {...item} />
  //     ))}
  //   </RadioGroup>
  // );

  return {
    isLocked: locked,
    getGroupProps: () => ({}),
    items,
  };
}

function _getItemLabel(valueItem: HookRadioGroupPropertyValueItem, showCodes: boolean): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return valueItem.text + (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "");
}

function _getItemInvalidMessage(
  valueItem: HookRadioGroupPropertyValueItem,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint
): string {
  return filterPrettyPrint(valueItem.validationFilter);
}

function _isValueItemValid(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItem: HookRadioGroupPropertyValueItem,
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

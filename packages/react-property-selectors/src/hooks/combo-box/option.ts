import {
  PropertyFilter,
  PropertyValue,
  PropertyValueSet
} from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export type Option = {
  readonly value: string;
  readonly label: string;
  readonly isItemValid: boolean;
  readonly image: string | undefined;
  readonly toolTip: string;
};

export type GetSelectedOptionParams = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<ValueItem>;
};

export type ValueItem = {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
};

export type GetOptionsParams = {
  readonly sortValidFirst: boolean;
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<ValueItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly comparer?: PropertyValue.Comparer;
};

export function getOptions({
  sortValidFirst,
  propertyName,
  propertyValueSet,
  valueItems,
  showCodes,
  filterPrettyPrint,
  comparer
}: GetOptionsParams): ReadonlyArray<Option> {
  if (!valueItems) {
    valueItems = [];
  }

  // Convert value items to options
  const safeComparer = comparer || PropertyValue.defaultComparer;
  const options: Array<Option> = valueItems
    .map(valueItem => {
      const isItemValid = _isValueItemValid(
        propertyName,
        propertyValueSet,
        valueItem,
        safeComparer
      );
      return {
        value: _getItemValue(valueItem),
        label: _getItemLabel(valueItem, showCodes),
        isItemValid: isItemValid,
        image: valueItem.image,
        sortNo: valueItem.sortNo,
        toolTip: isItemValid
          ? ""
          : _getItemInvalidMessage(valueItem, filterPrettyPrint),
        getOptionProps: () => ({})
      };
    })
    .sort((a, b) => {
      if (sortValidFirst) {
        if (a.isItemValid && !b.isItemValid) {
          return -1;
        }
        if (!a.isItemValid && b.isItemValid) {
          return 1;
        }
      }

      if (a.sortNo < b.sortNo) {
        return -1;
      }
      if (a.sortNo > b.sortNo) {
        return 1;
      }
      return 0;
    });
  return options;
}

export function getSelectedOption(
  { propertyName, propertyValueSet, valueItems }: GetSelectedOptionParams,
  options: ReadonlyArray<Option>
): Option {
  if (!valueItems) {
    valueItems = [];
  }

  // Get selected option
  const value = PropertyValueSet.getInteger(propertyName, propertyValueSet);
  const selectedValueItemOrUndefined = valueItems.find(
    item => (item.value && PropertyValue.getInteger(item.value)) === value
  );
  let selectedValueItem: ValueItem;
  if (!selectedValueItemOrUndefined) {
    selectedValueItem = {
      value: undefined,
      sortNo: -1,
      text: value === undefined || value === null ? "" : value.toString(),
      validationFilter: PropertyFilter.Empty
    };
    // Add value items for selected value, even tough it does not really exist, but we need to show it in the combobox
    // valueItems.unshift(selectedValueItem);
    valueItems = [selectedValueItem, ...valueItems] as ReadonlyArray<ValueItem>;
  } else {
    selectedValueItem = selectedValueItemOrUndefined;
  }
  const selectedOption = options.find(
    option => option.value === _getItemValue(selectedValueItem)
  );
  if (!selectedOption) {
    throw new Error("Could not find..");
  }
  return selectedOption;
}

function _getItemLabel(valueItem: ValueItem, showCodes: boolean): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return (
    valueItem.text +
    (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "")
  );
}

function _getItemValue(valueItem: ValueItem): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return PropertyValue.toString(valueItem.value);
}

function _getItemInvalidMessage(
  valueItem: ValueItem,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint
): string {
  return filterPrettyPrint(valueItem.validationFilter);
}

function _isValueItemValid(
  propertyName: string,
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  valueItem: ValueItem,
  comparer: PropertyValue.Comparer
): boolean {
  if (valueItem.value === undefined || valueItem.value === null) {
    return true;
  }
  const pvsToCheck = PropertyValueSet.set(
    propertyName,
    valueItem.value,
    propertyValueSet
  );
  if (!valueItem.validationFilter) {
    return true;
  }
  return PropertyFilter.isValid(
    pvsToCheck,
    valueItem.validationFilter,
    comparer
  );
}

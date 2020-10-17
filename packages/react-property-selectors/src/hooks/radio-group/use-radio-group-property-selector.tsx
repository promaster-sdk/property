import { PropertyValue, PropertyValueSet, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { getSelectableOptions } from "../option";

export type UseRadioGroupPropertySelectorOptions = {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly sortValidFirst: boolean;
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
  readonly isItemValid: boolean;
};

export function useRadioGroupPropertySelector(
  hookOptions: UseRadioGroupPropertySelectorOptions
): UseRadioGroupPropertySelector {
  const { onValueChange, locked } = hookOptions;

  const [selectedOption, selectableOptions] = getSelectableOptions(hookOptions);

  // Convert value items to options
  const items: Array<RadioGroupItemInfo> = selectableOptions
    .map((o) => {
      return {
        getItemProps: () => ({
          key: o.sortNo.toString(),
          onClick: () => _doOnChange(o.value, onValueChange),
        }),
        sortNo: o.sortNo,
        selected: o === selectedOption,
        label: o.label,
        imageUrl: o.image,
        toolTip: selectedOption.toolTip,
        isItemValid: o.isItemValid,
      };
    })
    .sort((a, b) => a.sortNo - b.sortNo);

  return {
    isLocked: locked,
    getGroupProps: () => ({}),
    items,
  };
}

export function getDefaultRadioItemStyle(item: RadioGroupItemInfo): {} {
  return {
    cursor: item.isItemValid ? "pointer" : "not-allowed",
    display: "inline-block",
    marginRight: "10px",
    padding: "10px",
    border: item.selected ? "2px solid " + (item.isItemValid ? "#39f" : "red") : "2px solid transparent",
    color: item.isItemValid ? "black" : "grey",
    // ${(p: RadioGroupItemProps) =>
    //   p.isItemValid ? "&:hover { background: #39f; color: white;" : ""}
  };
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

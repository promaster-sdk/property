import { useState } from "react";
import { PropertyValueSet, PropertyValue, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { exhaustiveCheck } from "@promaster-sdk/property/lib/utils/exhaustive-check";
import { DiscretePropertySelectorOptions, GetItemFilter, GetItemValue, ItemComparer } from "../discrete";
import { formatsArrayToZipList, SelectableFormat, UnitLabels, UseAmountPropertySelectorOptions } from "../amount";
import { UseTextboxPropertySelectorOptions } from "../textbox";

export type GetPropertyInfo<TPropertyDef, TPropertyValueDef> = (
  property: TPropertyDef
) => PropertyInfo<TPropertyValueDef>;

export type OnPropertiesChanged = (
  properties: PropertyValueSet.PropertyValueSet,
  propertyNames: ReadonlyArray<string>
) => void;

export type UsePropertiesSelectorOptions<TPropertyDef, TPropertyValueDef> = {
  /**
   * An array of objects representing the properties that should be selectable. The type of the objects can be
   * anything the application wants, so the application also needs to provide several functions
   * to extract information from these objects that the selector needs.
   */
  readonly properties: ReadonlyArray<TPropertyDef>;
  /**
   * From a property object, extract information needed by the selector.
   */
  readonly getPropertyInfo: GetPropertyInfo<TPropertyDef, TPropertyValueDef>;
  /**
   * From an item object, extract the property value.
   */
  readonly getItemValue: GetItemValue<TPropertyValueDef>;
  /**
   * From an item, get the property filter. The items can be any object the application wants, so therefore the
   * application must provide this function to extract the property value from the item.
   */
  readonly getItemFilter: GetItemFilter<TPropertyValueDef>;
  /**
   * Get an item that corresponds to a property value of undefined. This item will be shown
   * in eg. a dropdown when the value of the property is undefiend.
   */
  readonly getUndefinedValueItem: () => TPropertyValueDef;
  /**
   * The currently selected properties in the selector.
   */
  readonly selectedProperties: PropertyValueSet.PropertyValueSet;
  /**
   * Will be called when selected properties changes.
   */
  readonly onChange?: OnPropertiesChanged;
  /**
   * Will be called when the user selects a different format (unit, decimals) for an amount property.
   */
  readonly onPropertyFormatChanged?: (propertyName: string, selectedFormat: SelectableFormat) => void;
  /**
   * Will be called when the user wants to reset the format of a property to the default.
   */
  readonly onPropertyFormatCleared?: (propertyName: string) => void;

  // Debounce value for inputs in ms. Defaults to 350.
  readonly inputDebounceTime?: number;

  // Used to print error messages
  readonly filterPrettyPrint?: PropertyFiltering.FilterPrettyPrint;
  // Translations
  readonly valueMustBeNumericMessage?: string;
  readonly valueIsRequiredMessage?: string;

  // Includes the raw property name and value in paranthesis
  readonly showCodes?: boolean;
  // Will render properties that according to their rule should be hidden
  readonly includeHiddenProperties?: boolean;
  // Will automatically select values for properties that have only one valid value
  readonly autoSelectSingleValidValue?: boolean;
  // Locks fields with single valid value
  readonly lockSingleValidValue?: boolean;
  // Sort valid values first
  readonly sortValidFirst?: boolean;

  // Group handling
  readonly initiallyClosedGroups?: ReadonlyArray<string>;

  // Comparer
  readonly valueComparer?: PropertyValue.Comparer;
  readonly itemComparer?: ItemComparer<TPropertyValueDef>;
  readonly propertyComparer?: (a: TPropertyDef, b: TPropertyDef) => number;

  readonly unitLables: UnitLabels;
};

export type BasePropertyInfo = {
  readonly name: string;
  readonly group: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly visibilityFilter: PropertyFilter.PropertyFilter;
  readonly isReadonly?: boolean;
  readonly isOptional?: boolean;
};

export type PropertyInfo<TPropertyValueDef> =
  | DiscretePropertyInfo<TPropertyValueDef>
  | TextPropertyInfo
  | AmountPropertyInfo;

export type DiscretePropertyInfo<TPropertyValueDef> = BasePropertyInfo & {
  readonly type: "Discrete";
  readonly items: ReadonlyArray<TPropertyValueDef>;
};

export type TextPropertyInfo = BasePropertyInfo & { readonly type: "Text" };

export type AmountPropertyInfo = BasePropertyInfo & {
  readonly type: "Amount";
  readonly selectableFormats: ReadonlyArray<SelectableFormat>;
  readonly selectedFormat: SelectableFormat;
};

export type GroupToggleButtonProps = { readonly onClick: React.MouseEventHandler<{}> };

export type UsePropertiesSelectorHook<TPropertyDef, TPropertyValueDef> = {
  readonly getPropertySelectorHookInfo: (property: TPropertyDef) => PropertySelectorHookInfo<TPropertyValueDef>;
  readonly groups: ReadonlyArray<string>;
  // Used to add code if includeCodes is true
  readonly getPropertyLabel: (property: TPropertyDef, propertyText: string) => string;
  // If includeHiddenProperties was specified, the selector may have been rendered even if it is supposed to be hidden
  readonly isPropertyHidden: (property: TPropertyDef) => boolean;
  readonly isPropertyValid: (property: TPropertyDef) => boolean;
  readonly getGroupToggleButtonProps: (group: string) => GroupToggleButtonProps;
  readonly isGroupClosed: (group: string) => boolean;
  readonly getGroupProperties: (group: string) => ReadonlyArray<TPropertyDef>;
};

export type PropertySelectorHookInfo<TPropertyValueDef> =
  | {
      readonly type: "Discrete";
      readonly getUseDiscreteOptions: () => DiscretePropertySelectorOptions<TPropertyValueDef>;
    }
  | {
      readonly type: "AmountField";
      readonly getUseAmountOptions: () => UseAmountPropertySelectorOptions;
    }
  | {
      readonly type: "TextBox";
      readonly getUseTextboxOptions: () => UseTextboxPropertySelectorOptions;
    };

export function usePropertiesSelector<TPropertyDef, TPropertyValueDef>(
  options: UsePropertiesSelectorOptions<TPropertyDef, TPropertyValueDef>
): UsePropertiesSelectorHook<TPropertyDef, TPropertyValueDef> {
  const requiredOptions = optionsWithDefaults(options);

  const {
    properties: propertiesUnsorted,
    selectedProperties,
    includeHiddenProperties,
    valueComparer,
    propertyComparer,
    getPropertyInfo,
    showCodes,
    getItemFilter,
    getItemValue,
  } = requiredOptions;

  // Get sorted properties and only include the ones that should be visible
  const properties = propertiesUnsorted
    .slice()
    .sort(propertyComparer)
    .filter((property) => {
      const pi = getPropertyInfo(property);
      return includeHiddenProperties || PropertyFilter.isValid(selectedProperties, pi.visibilityFilter, valueComparer);
    });

  const selectorHookMap: Map<TPropertyDef, PropertySelectorHookInfo<TPropertyValueDef>> = new Map(
    properties.map((p) => [p, createSelectorHookInfo(p, requiredOptions)])
  );

  const [closedGroups, setClosedGroups] = useState<ReadonlyArray<string>>(requiredOptions.initiallyClosedGroups);

  return {
    getPropertySelectorHookInfo: (property) => selectorHookMap.get(property)!,
    getGroupToggleButtonProps: (group: string) => ({
      onClick: () =>
        setClosedGroups(
          closedGroups.indexOf(group) >= 0 ? closedGroups.filter((g) => g !== group) : [...closedGroups, group]
        ),
    }),
    getPropertyLabel: (property, propertyText) =>
      propertyText + (showCodes ? " (" + getPropertyInfo(property).name + ")" : ""),
    isPropertyHidden: (property) => {
      const isHidden = !PropertyFilter.isValid(
        selectedProperties,
        getPropertyInfo(property).visibilityFilter,
        valueComparer
      );
      return isHidden;
    },
    isPropertyValid: (property) => {
      const pi = getPropertyInfo(property);
      const propertyItems = pi.type === "Discrete" ? pi.items : undefined;
      const selectedItemValue = PropertyValueSet.getValue(pi.name, selectedProperties);
      const selectedItem = getSelectedItem(propertyItems, selectedItemValue, getItemValue, valueComparer);
      return getIsValid(pi, selectedItem, selectedProperties, valueComparer, getItemFilter);
    },
    isGroupClosed: (group: string) => closedGroups.indexOf(group) !== -1,
    getGroupProperties: (group: string) =>
      properties.filter((property) => getPropertyInfo(property).group === (group || "")),
    groups: getDistinctGroupNames(properties.map(getPropertyInfo)),
  };
}

function createSelectorHookInfo<TPropertyDef, TPropertyValueDef>(
  property: TPropertyDef,
  options: Required<UsePropertiesSelectorOptions<TPropertyDef, TPropertyValueDef>>
): PropertySelectorHookInfo<TPropertyValueDef> {
  const {
    selectedProperties,
    valueComparer,
    properties,
    autoSelectSingleValidValue,
    showCodes,
    inputDebounceTime,
    valueMustBeNumericMessage,
    valueIsRequiredMessage,
    onChange,
    filterPrettyPrint,
    onPropertyFormatChanged,
    onPropertyFormatCleared,
    lockSingleValidValue,
    sortValidFirst,
    getUndefinedValueItem,
    getItemValue,
    getItemFilter,
    itemComparer,
    getPropertyInfo,
    unitLables,
  } = options;

  const propertyInfo = getPropertyInfo(property);

  // // TODO: Better handling of format to use when the format is missing in the map
  // const defaultFormat = getDefaultFormat(propertyInfo, selectedItemValue);
  // const propertyFormat = getPropertyFormat(propertyInfo.name) || defaultFormat;

  const readOnly = !!propertyInfo.isReadonly;
  const propertyOnChange = handleChange(
    onChange,
    properties,
    autoSelectSingleValidValue,
    valueComparer,
    getItemValue,
    getItemFilter,
    getPropertyInfo
  );
  const propertyName = propertyInfo.name;

  function onValueChange(newValue: PropertyValue.PropertyValue): void {
    propertyOnChange(
      newValue
        ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
        : PropertyValueSet.removeProperty(propertyName, selectedProperties),
      propertyName
    );
  }

  switch (propertyInfo.type) {
    case "Text": {
      return {
        type: "TextBox",
        getUseTextboxOptions: () => ({
          propertyName,
          propertyValueSet: selectedProperties,
          readOnly,
          onValueChange,
          debounceTime: inputDebounceTime,
        }),
      };
    }
    case "Amount": {
      return {
        type: "AmountField",
        getUseAmountOptions: () => ({
          propertyName,
          propertyValueSet: selectedProperties,
          onFormatChanged: (format: SelectableFormat) => {
            onPropertyFormatChanged(propertyName, format);
          },
          onFormatCleared: () => onPropertyFormatCleared(propertyName),
          onValueChange,
          notNumericMessage: valueMustBeNumericMessage,
          // If it is optional then use blank required message
          isRequiredMessage: propertyInfo.isOptional ? "" : valueIsRequiredMessage,
          validationFilter: propertyInfo.validationFilter,
          filterPrettyPrint,
          readOnly: readOnly,
          debounceTime: inputDebounceTime,
          getSelectableFormats: () => {
            return formatsArrayToZipList(propertyInfo.selectableFormats ?? [], propertyInfo.selectedFormat);
          },
          unitLabels: unitLables,
        }),
      };
    }
    case "Discrete": {
      const selectedItemValue = PropertyValueSet.getValue(propertyInfo.name, selectedProperties);
      const selectedItem = getSelectedItem(propertyInfo.items, selectedItemValue, getItemValue, valueComparer);

      const locked = lockSingleValidValue
        ? isSingleValidValue(selectedItem, propertyInfo.items, selectedProperties, valueComparer, getItemFilter)
        : false;

      return {
        type: "Discrete",
        getUseDiscreteOptions: () => ({
          getUndefinedValueItem,
          getItemValue,
          getItemFilter,
          sortValidFirst,
          propertyName,
          propertyValueSet: selectedProperties,
          items: propertyInfo.items,
          showCodes: showCodes,
          filterPrettyPrint,
          onValueChange,
          disabled: readOnly || locked,
          itemComparer,
        }),
      };
    }
    default:
      return exhaustiveCheck(propertyInfo, true);
  }
}

function getSelectedItem<TPropertyValueDef>(
  items: ReadonlyArray<TPropertyValueDef> | undefined,
  selectedItemValue: PropertyValue.PropertyValue,
  getItemValue: GetItemValue<TPropertyValueDef>,
  valueComparer: PropertyValue.Comparer
): TPropertyValueDef | undefined {
  const selectedItem =
    items &&
    items.find((item) => {
      const itemValue = getItemValue(item);
      return (
        (itemValue === undefined && selectedItemValue === undefined) ||
        (itemValue && PropertyValue.equals(selectedItemValue, itemValue, valueComparer))
      );
    });
  return selectedItem;
}

function getIsValid<TPropertyValueDef>(
  property: PropertyInfo<TPropertyValueDef>,
  selectedValueItem: TPropertyValueDef | undefined,
  selectedProperties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TPropertyValueDef>
): boolean {
  switch (property.type) {
    case "Discrete":
      return selectedValueItem
        ? PropertyFilter.isValid(selectedProperties, getItemFilter(selectedValueItem), comparer)
        : false;
    case "Amount":
      return (
        property.validationFilter && PropertyFilter.isValid(selectedProperties, property.validationFilter, comparer)
      );
    default:
      return true;
  }
}

function isSingleValidValue<TPropertyValueDef>(
  selectedValueItem: TPropertyValueDef | undefined,
  propertyItems: ReadonlyArray<TPropertyValueDef>,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TPropertyValueDef>
): boolean {
  const singleValidValue = getSingleValidItemOrUndefined(propertyItems, properties, comparer, getItemFilter);

  // getSingleValidValueOrUndefined only works on onChange.
  // Prevent locking when the sent in selectedValue isn't the singleValidValue
  if (singleValidValue && singleValidValue === selectedValueItem) {
    return true;
  }

  return false;
}

function handleChange<TPropertyValueDef, TPropertyDef>(
  externalOnChange: OnPropertiesChanged,
  productProperties: ReadonlyArray<TPropertyDef>,
  autoSelectSingleValidValue: boolean,
  comparer: PropertyValue.Comparer,
  getItemValue: GetItemValue<TPropertyValueDef>,
  getItemFilter: GetItemFilter<TPropertyValueDef>,
  getPropertyInfo: GetPropertyInfo<TPropertyDef, TPropertyValueDef>
): (properties: PropertyValueSet.PropertyValueSet, propertyName: string) => void {
  return (properties: PropertyValueSet.PropertyValueSet, propertyName: string) => {
    if (!autoSelectSingleValidValue) {
      externalOnChange(properties, [propertyName]);
      return;
    }

    let lastProperties = properties;
    const changedProps = new Set([propertyName]);

    for (let i = 0; i < 4; i++) {
      for (const property of productProperties) {
        const propertyInfo = getPropertyInfo(property);
        if (propertyInfo.name === propertyName || propertyInfo.type !== "Discrete") {
          continue;
        }
        const singleItem = getSingleValidItemOrUndefined(propertyInfo.items, properties, comparer, getItemFilter);
        const singleItemValue = singleItem && getItemValue(singleItem);
        if (singleItem && singleItemValue) {
          properties = PropertyValueSet.set(propertyInfo.name, singleItemValue, properties);
          changedProps.add(propertyInfo.name);
        }
      }

      if (properties === lastProperties) {
        break;
      }

      lastProperties = properties;
    }

    externalOnChange(properties, Array.from(changedProps.keys()));
  };
}

function getSingleValidItemOrUndefined<TPropertyValueDef>(
  propertyItems: ReadonlyArray<TPropertyValueDef>,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TPropertyValueDef>
): TPropertyValueDef | undefined {
  const validPropertyValueItems: Array<TPropertyValueDef> = [];
  for (const productValueItem of propertyItems) {
    const isValid = PropertyFilter.isValid(properties, getItemFilter(productValueItem), comparer);

    if (isValid) {
      validPropertyValueItems.push(productValueItem);
    }
  }

  return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : undefined;
}

function getDistinctGroupNames<TPropertyValueDef>(
  pis: ReadonlyArray<PropertyInfo<TPropertyValueDef>>
): ReadonlyArray<string> {
  const groupNames: Array<string> = [];
  for (const pi of pis) {
    // let groupName = property.groupName;
    if (isNullOrWhiteSpace(pi.group)) {
      // groupName = "";
    }
    if (groupNames.indexOf(pi.group) === -1) {
      groupNames.push(pi.group);
    }
  }
  return groupNames;
}

function isNullOrWhiteSpace(str: string): boolean {
  return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, "").length < 1;
}

function optionsWithDefaults<TPropertyDef, TPropertyValueDef>(
  options: UsePropertiesSelectorOptions<TPropertyDef, TPropertyValueDef>
): Required<UsePropertiesSelectorOptions<TPropertyDef, TPropertyValueDef>> {
  return {
    ...options,
    filterPrettyPrint:
      options.filterPrettyPrint ??
      ((propertyFilter: PropertyFilter.PropertyFilter) => PropertyFilter.toString(propertyFilter)),

    showCodes: options.showCodes ?? false,
    includeHiddenProperties: options.includeHiddenProperties ?? false,
    autoSelectSingleValidValue: options.autoSelectSingleValidValue ?? true,
    lockSingleValidValue: options.lockSingleValidValue ?? false,
    onChange:
      options.onChange ?? ((_a: PropertyValueSet.PropertyValueSet, _propertyName: ReadonlyArray<string>) => ({})),
    onPropertyFormatChanged: options.onPropertyFormatChanged ?? ((_a: string, _b: SelectableFormat) => ({})),
    onPropertyFormatCleared: options.onPropertyFormatCleared ?? ((_a: string) => ({})),

    valueMustBeNumericMessage: options.valueMustBeNumericMessage ?? "value_must_be_numeric",
    valueIsRequiredMessage: options.valueIsRequiredMessage ?? "value_is_required",
    inputDebounceTime: options.inputDebounceTime ?? 350,

    initiallyClosedGroups: options.initiallyClosedGroups ?? [],

    valueComparer: options.valueComparer ?? PropertyValue.defaultComparer,
    sortValidFirst: options.sortValidFirst ?? false,
    itemComparer: options.itemComparer ?? (() => 0),
    propertyComparer: options.propertyComparer ?? (() => 0),
  };
}

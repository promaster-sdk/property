import { useState } from "react";
import { Unit, UnitFormat } from "uom";
import { PropertyValueSet, PropertyValue, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { exhaustiveCheck } from "@promaster-sdk/property/lib/utils/exhaustive-check";
import { DiscretePropertySelectorOptions, GetItemFilter, GetItemValue, ItemComparer } from "../discrete";
import { UseAmountPropertySelectorOptions } from "../amount";
import { UseTextboxPropertySelectorOptions } from "../textbox";

export type GetPropertyInfo<TProperty> = (property: TProperty) => PropertyInfo;
export type GetPropertyItems<TItem, TProperty> = (property: TProperty) => ReadonlyArray<TItem>;
export type OnPropertiesChanged = (
  properties: PropertyValueSet.PropertyValueSet,
  propertyNames: ReadonlyArray<string>
) => void;
export type UsePropertiesSelectorAmountFormat = {
  readonly unit: Unit.Unit<unknown>;
  readonly decimalCount: number;
};

export type UsePropertiesSelectorOptions<TItem, TProperty> = {
  // Required inputs
  readonly properties: ReadonlyArray<TProperty>;
  readonly getPropertyInfo: GetPropertyInfo<TProperty>;
  readonly getPropertyItems: GetPropertyItems<TItem, TProperty>;

  readonly selectedProperties: PropertyValueSet.PropertyValueSet;

  // Used to print error messages
  readonly filterPrettyPrint?: PropertyFiltering.FilterPrettyPrint;

  // Get an item that corresponds to a property value of undefined
  readonly getUndefinedValueItem: () => TItem;
  readonly getItemValue: GetItemValue<TItem>;
  readonly getItemFilter: GetItemFilter<TItem>;

  // Includes the raw property name and value in paranthesis
  readonly showCodes?: boolean;
  // Will render properties that according to their rule should be hidden
  readonly includeHiddenProperties?: boolean;
  // Will automatically select values for properties that have only one valid value
  readonly autoSelectSingleValidValue?: boolean;
  // Locks fields with single valid value
  readonly lockSingleValidValue?: boolean;

  // Events
  readonly onChange?: OnPropertiesChanged;
  readonly onPropertyFormatChanged?: (propertyName: string, unit: Unit.Unit<unknown>, decimalCount: number) => void;
  readonly onPropertyFormatCleared?: (propertyName: string) => void;

  // Translations
  readonly valueMustBeNumericMessage?: string;
  readonly valueIsRequiredMessage?: string;

  // Specifies property names of properties that should be read-only
  readonly readOnlyProperties?: ReadonlyArray<string>;
  // Specifies property names of properties that should be optional (only for amounts for now)
  readonly optionalProperties?: ReadonlyArray<string>;
  // Specifies input format per property name for entering amount properties (measure unit and decimal count)
  readonly propertyFormats?: {
    readonly [key: string]: UsePropertiesSelectorAmountFormat;
  };

  // Debounce value for inputs in ms. Defaults to 350.
  readonly inputDebounceTime?: number;

  // Group handling
  readonly initiallyClosedGroups?: ReadonlyArray<string>;

  // Use customUnits
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  readonly units: Unit.UnitMap;
  readonly unitLookup: Unit.UnitLookup;

  // Comparer
  readonly valueComparer?: PropertyValue.Comparer;
  readonly itemComparer?: ItemComparer<TItem>;
  readonly propertyComparer?: (a: TProperty, b: TProperty) => number;

  readonly sortValidFirst?: boolean;
};

export type PropertyInfo = {
  readonly fieldName?: string;
  readonly name: string;
  readonly group: string;
  readonly quantity: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly visibilityFilter: PropertyFilter.PropertyFilter;
};

export type UsePropertiesSelector<TItem, TProperty> = {
  readonly getPropertySelectorHook: (property: TProperty) => PropertySelectorHookInfo<TItem>;
  readonly groups: ReadonlyArray<string>;
  // Used to add code if includeCodes is true
  readonly getPropertyLabel: (property: TProperty, propertyText: string) => string;
  // If includeHiddenProperties was specified, the selector may have been rendered even if it is supposed to be hidden
  readonly isPropertyHidden: (property: TProperty) => boolean;
  readonly isPropertyValid: (property: TProperty) => boolean;
  readonly getGroupToggleButtonProps: (group: string) => React.SelectHTMLAttributes<HTMLButtonElement>;
  readonly isGroupClosed: (group: string) => boolean;
  readonly getGroupProperties: (group: string) => ReadonlyArray<TProperty>;
};

export type PropertySelectorHookInfo<TItem> =
  | {
      readonly type: "Discrete";
      readonly getUseDiscreteOptions: () => DiscretePropertySelectorOptions<TItem>;
    }
  | {
      readonly type: "AmountField";
      readonly getUseAmountOptions: () => UseAmountPropertySelectorOptions;
    }
  | {
      readonly type: "TextBox";
      readonly getUseTextboxOptions: () => UseTextboxPropertySelectorOptions;
    };

export function usePropertiesSelector<TItem, TProperty>(
  options: UsePropertiesSelectorOptions<TItem, TProperty>
): UsePropertiesSelector<TItem, TProperty> {
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
    getPropertyItems,
  } = requiredOptions;

  // Get sorted properties and only include the ones that should be visible
  const properties = propertiesUnsorted
    .slice()
    .sort(propertyComparer)
    .filter((property) => {
      const pi = getPropertyInfo(property);
      return includeHiddenProperties || PropertyFilter.isValid(selectedProperties, pi.visibilityFilter, valueComparer);
    });

  const selectorHookMap: Map<TProperty, PropertySelectorHookInfo<TItem>> = new Map(
    properties.map((p) => [p, createSelectorHookInfo(p, requiredOptions)])
  );

  const [closedGroups, setClosedGroups] = useState<ReadonlyArray<string>>(requiredOptions.initiallyClosedGroups);

  return {
    getPropertySelectorHook: (property) => selectorHookMap.get(property)!,
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
      const selectedItemValue = PropertyValueSet.getValue(pi.name, selectedProperties);
      const selectedItem = getSelectedItem(selectedItemValue, property, getItemValue, getPropertyItems, valueComparer);
      return getIsValid(pi, selectedItem, selectedProperties, valueComparer, getItemFilter);
    },
    isGroupClosed: (group: string) => closedGroups.indexOf(group) !== -1,
    getGroupProperties: (group: string) =>
      properties.filter((property) => getPropertyInfo(property).group === (group || "")),
    groups: getDistinctGroupNames(properties.map(getPropertyInfo)),
  };
}

function createSelectorHookInfo<TItem, TProperty>(
  property: TProperty,
  options: Required<UsePropertiesSelectorOptions<TItem, TProperty>>
): PropertySelectorHookInfo<TItem> {
  const {
    selectedProperties,
    propertyFormats,
    valueComparer,
    properties,
    autoSelectSingleValidValue,
    showCodes,
    inputDebounceTime,
    valueMustBeNumericMessage,
    valueIsRequiredMessage,
    onChange,
    optionalProperties,
    filterPrettyPrint,
    units,
    unitsFormat,
    onPropertyFormatChanged,
    onPropertyFormatCleared,
    lockSingleValidValue,
    readOnlyProperties,
    sortValidFirst,
    getUndefinedValueItem,
    getItemValue,
    getItemFilter,
    itemComparer,
    getPropertyInfo,
    getPropertyItems,
  } = options;

  const propertyInfo = getPropertyInfo(property);

  const selectedItemValue = PropertyValueSet.getValue(propertyInfo.name, selectedProperties);
  const selectedItem = getSelectedItem(selectedItemValue, property, getItemValue, getPropertyItems, valueComparer);

  // TODO: Better handling of format to use when the format is missing in the map
  const defaultFormat = getDefaultFormat(propertyInfo, selectedItemValue);
  const propertyFormat = propertyFormats[propertyInfo.name] || defaultFormat;

  const readOnly = readOnlyProperties.indexOf(propertyInfo.name) !== -1;
  const propertyOnChange = handleChange(
    onChange,
    properties,
    autoSelectSingleValidValue,
    valueComparer,
    getItemValue,
    getItemFilter,
    getPropertyInfo,
    getPropertyItems
  );
  const propertyName = propertyInfo.name;
  // const valueItems = propertyInfo.items;
  const locked =
    autoSelectSingleValidValue || lockSingleValidValue
      ? shouldBeLocked(
          selectedItem,
          getPropertyItems(property),
          propertyInfo,
          selectedProperties,
          valueComparer,
          getItemFilter
        )
      : false;

  function onValueChange(newValue: PropertyValue.PropertyValue): void {
    propertyOnChange(
      newValue
        ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
        : PropertyValueSet.removeProperty(propertyName, selectedProperties),
      propertyName
    );
  }

  const selectorType = getSelectorType(propertyInfo);
  switch (selectorType) {
    case "TextBox": {
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
    case "AmountField": {
      return {
        type: "AmountField",
        getUseAmountOptions: () => ({
          propertyName,
          propertyValueSet: selectedProperties,
          inputUnit: propertyFormat.unit,
          inputDecimalCount: propertyFormat.decimalCount,
          onFormatChanged: (unit: Unit.Unit<unknown>, decimalCount: number) =>
            onPropertyFormatChanged(propertyName, unit, decimalCount),
          onFormatCleared: () => onPropertyFormatCleared(propertyName),
          onValueChange,
          notNumericMessage: valueMustBeNumericMessage,
          fieldName: propertyInfo.fieldName || propertyInfo.name,
          // If it is optional then use blank required message
          isRequiredMessage:
            optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : valueIsRequiredMessage,
          validationFilter: propertyInfo.validationFilter,
          filterPrettyPrint,
          readOnly: readOnly,
          debounceTime: inputDebounceTime,
          unitsFormat,
          units,
        }),
      };
    }
    case "Discrete":
      return {
        type: "Discrete",
        getUseDiscreteOptions: () => ({
          getUndefinedValueItem,
          getItemValue,
          getItemFilter,
          sortValidFirst,
          propertyName,
          propertyValueSet: selectedProperties,
          items: getPropertyItems(property),
          showCodes: showCodes,
          filterPrettyPrint,
          onValueChange,
          disabled: readOnly || locked,
          itemComparer,
        }),
      };
    default:
      return exhaustiveCheck(selectorType, true);
  }
}

function getSelectedItem<TItem, TProperty>(
  selectedItemValue: PropertyValue.PropertyValue,
  property: TProperty,
  getItemValue: GetItemValue<TItem>,
  getPropertyItems: GetPropertyItems<TItem, TProperty>,
  valueComparer: PropertyValue.Comparer
): TItem | undefined {
  const items = getPropertyItems(property);
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

function getDefaultFormat(
  property: PropertyInfo,
  selectedValue: PropertyValue.PropertyValue
): UsePropertiesSelectorAmountFormat {
  const defaultFormat: UsePropertiesSelectorAmountFormat = { unit: Unit.One, decimalCount: 2 };
  const propertyType = getPropertyType(property.quantity);
  switch (propertyType) {
    case "text":
    case "integer":
      return defaultFormat;
    case "amount":
      return selectedValue && selectedValue.type === "amount"
        ? {
            unit: selectedValue.value.unit,
            decimalCount: selectedValue.value.decimalCount,
          }
        : defaultFormat;
    default:
      return exhaustiveCheck(propertyType, true);
  }
}

function getIsValid<TItem>(
  property: PropertyInfo,
  selectedValueItem: TItem | undefined,
  selectedProperties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TItem>
): boolean {
  switch (getPropertyType(property.quantity)) {
    case "integer":
      return selectedValueItem
        ? PropertyFilter.isValid(selectedProperties, getItemFilter(selectedValueItem), comparer)
        : false;
    case "amount":
      return (
        property.validationFilter && PropertyFilter.isValid(selectedProperties, property.validationFilter, comparer)
      );
    default:
      return true;
  }
}

function getSelectorType<TItem>(propertyInfo: PropertyInfo): PropertySelectorHookInfo<TItem>["type"] {
  if (propertyInfo.quantity === "Text") {
    return "TextBox";
  } else if (propertyInfo.quantity === "Discrete") {
    return "Discrete";
  } else {
    return "AmountField";
  }
}

function getPropertyType(quantity: string): PropertyValue.PropertyType {
  switch (quantity) {
    case "Text":
      return "text";
    case "Discrete":
      return "integer";
    default:
      return "amount";
  }
}

function shouldBeLocked<TItem>(
  selectedValueItem: TItem | undefined,
  propertyItems: ReadonlyArray<TItem>,
  propertyInfo: PropertyInfo,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TItem>
): boolean {
  const singleValidValue = getSingleValidItemOrUndefined(
    propertyItems,
    propertyInfo,
    properties,
    comparer,
    getItemFilter
  );

  // getSingleValidValueOrUndefined only works on onChange.
  // Prevent locking when the sent in selectedValue isn't the singleValidValue
  if (singleValidValue && singleValidValue === selectedValueItem) {
    return true;
  }

  return false;
}

function handleChange<TItem, TPropety>(
  externalOnChange: OnPropertiesChanged,
  productProperties: ReadonlyArray<TPropety>,
  autoSelectSingleValidValue: boolean,
  comparer: PropertyValue.Comparer,
  getItemValue: GetItemValue<TItem>,
  getItemFilter: GetItemFilter<TItem>,
  getPropertyInfo: GetPropertyInfo<TPropety>,
  getPropertyItems: GetPropertyItems<TItem, TPropety>
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
        if (propertyInfo.name === propertyName) {
          continue;
        }
        const propertyItems = getPropertyItems(property);
        const singleItem = getSingleValidItemOrUndefined(
          propertyItems,
          propertyInfo,
          properties,
          comparer,
          getItemFilter
        );
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

function getSingleValidItemOrUndefined<TItem>(
  propertyItems: ReadonlyArray<TItem>,
  propertyInfo: PropertyInfo,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TItem>
): TItem | undefined {
  if (propertyInfo.quantity === "Discrete") {
    const validPropertyValueItems: Array<TItem> = [];
    for (const productValueItem of propertyItems) {
      const isValid = PropertyFilter.isValid(properties, getItemFilter(productValueItem), comparer);

      if (isValid) {
        validPropertyValueItems.push(productValueItem);
      }
    }

    return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : undefined;
  }

  return undefined;
}

function getDistinctGroupNames(pis: ReadonlyArray<PropertyInfo>): ReadonlyArray<string> {
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

function optionsWithDefaults<TItem, TPropety>(
  options: UsePropertiesSelectorOptions<TItem, TPropety>
): Required<UsePropertiesSelectorOptions<TItem, TPropety>> {
  return {
    ...options,
    filterPrettyPrint:
      options.filterPrettyPrint ||
      ((propertyFilter: PropertyFilter.PropertyFilter) =>
        PropertyFiltering.filterPrettyPrintIndented(
          PropertyFiltering.buildEnglishMessages(options.unitsFormat),
          2,
          " ",
          propertyFilter,
          options.unitsFormat,
          options.unitLookup
        )),

    showCodes: options.showCodes || false,
    includeHiddenProperties: options.includeHiddenProperties || false,
    autoSelectSingleValidValue: options.autoSelectSingleValidValue || true,
    lockSingleValidValue: options.lockSingleValidValue || false,
    onChange:
      options.onChange || ((_a: PropertyValueSet.PropertyValueSet, _propertyName: ReadonlyArray<string>) => ({})),
    onPropertyFormatChanged:
      options.onPropertyFormatChanged || ((_a: string, _b: Unit.Unit<unknown>, _c: number) => ({})),
    onPropertyFormatCleared: options.onPropertyFormatCleared || ((_a: string) => ({})),

    valueMustBeNumericMessage: options.valueMustBeNumericMessage || "value_must_be_numeric",
    valueIsRequiredMessage: options.valueIsRequiredMessage || "value_is_required",

    readOnlyProperties: options.readOnlyProperties || [],
    optionalProperties: options.optionalProperties || [],
    propertyFormats: options.propertyFormats || {},

    inputDebounceTime: options.inputDebounceTime || 350,

    initiallyClosedGroups: options.initiallyClosedGroups || [],

    valueComparer: options.valueComparer || PropertyValue.defaultComparer,
    sortValidFirst: options.sortValidFirst || false,
    itemComparer: options.itemComparer || (() => 0),
    propertyComparer: options.propertyComparer || (() => 0),
  };
}

import { useState } from "react";
import { Unit, UnitFormat } from "uom";
import { PropertyValueSet, PropertyValue, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { exhaustiveCheck } from "@promaster-sdk/property/lib/utils/exhaustive-check";
import { DiscretePropertySelectorOptions, GetItemFilter, GetItemValue, ItemComparer } from "../discrete";
import { UseAmountPropertySelectorOptions } from "../amount";
import { UseTextboxPropertySelectorOptions } from "../textbox";

export type GetPropertyInfo<TItem, TProperty> = (property: TProperty) => PropertyInfo<TItem>;
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
  readonly getPropertyInfo: GetPropertyInfo<TItem, TProperty>;
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

export type PropertyInfo<TItem> = {
  readonly fieldName?: string;
  readonly name: string;
  readonly group: string;
  readonly quantity: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly visibilityFilter: PropertyFilter.PropertyFilter;
  readonly items: ReadonlyArray<TItem>;
};

export type UsePropertiesSelector<TItem, TProperty> = {
  readonly getPropertySelectorHook: (property: TProperty) => PropertySelectorHookInfo<TItem>;
  readonly groups: ReadonlyArray<PropertiesSelectorGroup<TProperty>>;
  // Used to add code if includeCodes is true
  readonly getPropertyLabel: (property: TProperty, propertyText: string) => string;
  // If includeHiddenProperties was specified, the selector may have been rendered even if it is supposed to be hidden
  readonly isPropertyHidden: (property: TProperty) => boolean;
  readonly isPropertyValid: (property: TProperty) => boolean;
};

export type PropertiesSelectorGroup<TProperty> = {
  readonly name: string;
  readonly isClosed: boolean;
  readonly properties: ReadonlyArray<TProperty>;
  readonly getGroupToggleButtonProps: () => React.SelectHTMLAttributes<HTMLButtonElement>;
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
  } = requiredOptions;

  const properties = propertiesUnsorted.slice().sort(propertyComparer);

  const selectorHookMap: Map<TProperty, PropertySelectorHookInfo<TItem>> = new Map(
    properties.map((p) => [p, createSelectorHookInfo(getPropertyInfo(p), requiredOptions)])
  );

  const [closedGroups, setClosedGroups] = useState<ReadonlyArray<string>>(requiredOptions.initiallyClosedGroups);

  return {
    getPropertySelectorHook: (property) => selectorHookMap.get(property)!,
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
      const selectedItem = getSelectedItem(selectedItemValue, pi, getItemValue, valueComparer);
      return getIsValid(pi, selectedItem, selectedProperties, valueComparer, getItemFilter);
    },
    groups: getDistinctGroupNames(properties, getPropertyInfo).map((name) => {
      const isClosed = closedGroups.indexOf(name) !== -1;
      const groupProperties = properties
        .filter((property) => {
          const pi = getPropertyInfo(property);
          return (
            includeHiddenProperties || PropertyFilter.isValid(selectedProperties, pi.visibilityFilter, valueComparer)
          );
        })
        .filter((property) => getPropertyInfo(property).group === (name || ""));
      return {
        name,
        isClosed,
        getGroupToggleButtonProps: () => ({
          onClick: () =>
            setClosedGroups(
              closedGroups.indexOf(name) >= 0 ? closedGroups.filter((g) => g !== name) : [...closedGroups, name]
            ),
        }),
        properties: groupProperties,
      };
    }),
  };
}

function createSelectorHookInfo<TItem, TProperty>(
  propertyInfo: PropertyInfo<TItem>,
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
  } = options;

  const selectedItemValue = PropertyValueSet.getValue(propertyInfo.name, selectedProperties);
  const selectedItem = getSelectedItem(selectedItemValue, propertyInfo, getItemValue, valueComparer);

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
    getPropertyInfo
  );
  const fieldName = propertyInfo.fieldName || propertyInfo.name;
  const propertyName = propertyInfo.name;
  const validationFilter = propertyInfo.validationFilter;
  const valueItems = propertyInfo.items;
  const locked =
    autoSelectSingleValidValue || lockSingleValidValue
      ? shouldBeLocked(selectedItem, propertyInfo, selectedProperties, valueComparer, getItemFilter)
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
          fieldName: fieldName,
          // If it is optional then use blank required message
          isRequiredMessage:
            optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : valueIsRequiredMessage,
          validationFilter,
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
          valueItems,
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

function getSelectedItem<TItem>(
  selectedItemValue: PropertyValue.PropertyValue,
  propertyInfo: PropertyInfo<TItem>,
  getItemValue: GetItemValue<TItem>,
  valueComparer: PropertyValue.Comparer
): TItem | undefined {
  const selectedItem =
    propertyInfo.items &&
    propertyInfo.items.find((item) => {
      const itemValue = getItemValue(item);
      return (
        (itemValue === undefined && selectedItemValue === undefined) ||
        (itemValue && PropertyValue.equals(selectedItemValue, itemValue, valueComparer))
      );
    });
  return selectedItem;
}

function getDefaultFormat<TItem>(
  property: PropertyInfo<TItem>,
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
  property: PropertyInfo<TItem>,
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

function getSelectorType<TItem>(property: PropertyInfo<TItem>): PropertySelectorHookInfo<TItem>["type"] {
  if (property.quantity === "Text") {
    return "TextBox";
  } else if (property.quantity === "Discrete") {
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
  productProperty: PropertyInfo<TItem>,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TItem>
): boolean {
  const singleValidValue = getSingleValidItemOrUndefined(productProperty, properties, comparer, getItemFilter);

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
  getPropertyInfo: GetPropertyInfo<TItem, TPropety>
): (properties: PropertyValueSet.PropertyValueSet, propertyName: string) => void {
  return (properties: PropertyValueSet.PropertyValueSet, propertyName: string) => {
    if (!autoSelectSingleValidValue) {
      externalOnChange(properties, [propertyName]);
      return;
    }

    let lastProperties = properties;
    const changedProps = new Set([propertyName]);

    for (let i = 0; i < 4; i++) {
      for (const theProperty of productProperties) {
        const productProperty = getPropertyInfo(theProperty);
        if (productProperty.name === propertyName) {
          continue;
        }
        const singleItem = getSingleValidItemOrUndefined(productProperty, properties, comparer, getItemFilter);
        const singleItemValue = singleItem && getItemValue(singleItem);
        if (singleItem && singleItemValue) {
          properties = PropertyValueSet.set(productProperty.name, singleItemValue, properties);
          changedProps.add(productProperty.name);
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
  productProperty: PropertyInfo<TItem>,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer,
  getItemFilter: GetItemFilter<TItem>
  // getPropertyInfo: GetPropertyInfo<TItem, TProperty>
): TItem | undefined {
  // const productProperty = getPropertyInfo(theProperty);
  if (productProperty.quantity === "Discrete") {
    const validPropertyValueItems: Array<TItem> = [];
    for (const productValueItem of productProperty.items) {
      const isValid = PropertyFilter.isValid(properties, getItemFilter(productValueItem), comparer);

      if (isValid) {
        validPropertyValueItems.push(productValueItem);
      }
    }

    return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : undefined;
  }

  return undefined;
}

function getDistinctGroupNames<TItem, TProperty>(
  properties: ReadonlyArray<TProperty>,
  // productPropertiesArray: ReadonlyArray<SelectorRenderInfoInternal<TItem>>
  getPropertyInfo: GetPropertyInfo<TItem, TProperty>
): ReadonlyArray<string> {
  const groupNames: Array<string> = [];
  for (const property2 of properties) {
    const pi = getPropertyInfo(property2);
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

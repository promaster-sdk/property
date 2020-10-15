import { useState } from "react";
import { Unit, UnitFormat } from "uom";
import { PropertyValueSet, PropertyValue, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { exhaustiveCheck } from "@promaster-sdk/property/lib/utils/exhaustive-check";
import {
  UsePropertiesSelectorPropertySelectorType,
  UsePropertiesSelectorAmountFormat,
  UsePropertiesSelectorOnPropertyFormatChanged,
  UsePropertiesSelectorOnPropertyFormatCleared,
  UsePropertiesSelectorProperty,
  UsePropertiesSelectorPropertySelectorRenderInfo,
  UsePropertiesSelectorPropertyValueItem,
  UsePropertiesSelectorPropertyFormats,
  UsePropertiesSelectorOnPropertiesChanged,
  SelectorRenderInfo,
} from "./types";

export type UsePropertiesSelectorParams = {
  // Required inputs
  readonly productProperties: ReadonlyArray<UsePropertiesSelectorProperty>;
  readonly selectedProperties: PropertyValueSet.PropertyValueSet;

  // Used to print error messages
  readonly filterPrettyPrint?: PropertyFiltering.FilterPrettyPrint;

  // Includes the raw property name and value in paranthesis
  readonly includeCodes?: boolean;
  // Will render properties that according to their rule should be hidden
  readonly includeHiddenProperties?: boolean;
  // Will automatically select values for properties that have only one valid value
  readonly autoSelectSingleValidValue?: boolean;
  // Locks fields with single valid value
  readonly lockSingleValidValue?: boolean;

  // Events
  readonly onChange?: UsePropertiesSelectorOnPropertiesChanged;
  readonly onPropertyFormatChanged?: UsePropertiesSelectorOnPropertyFormatChanged;
  readonly onPropertyFormatCleared?: UsePropertiesSelectorOnPropertyFormatCleared;

  // Translations
  readonly valueMustBeNumericMessage?: string;
  readonly valueIsRequiredMessage?: string;

  // Specifies property names of properties that should be read-only
  readonly readOnlyProperties?: ReadonlyArray<string>;
  // Specifies property names of properties that should be optional (only for amounts for now)
  readonly optionalProperties?: ReadonlyArray<string>;
  // Specifies input format per property name for entering amount properties (measure unit and decimal count)
  readonly propertyFormats?: UsePropertiesSelectorPropertyFormats;

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
  readonly comparer?: PropertyValue.Comparer;
};

export type UsePropertiesSelector = {
  readonly groups: ReadonlyArray<UserPropertiesSelectorGroup>;
  // readonly onToggleGroupClosed: UsePropertiesSelectorOnToggleGroupClosed;
};

export type UserPropertiesSelectorGroup = {
  readonly name: string;
  readonly isClosed: boolean;
  readonly selectors: ReadonlyArray<UsePropertiesSelectorPropertySelectorRenderInfo>;
  readonly getGroupToggleButtonProps: () => React.SelectHTMLAttributes<HTMLButtonElement>;
};

export function usePropertiesSelector(params: UsePropertiesSelectorParams): UsePropertiesSelector {
  const p = paramsWithDefaults(params);

  const allSelectors = createPropertySelectorRenderInfos(p);

  const [closedGroups, setClosedGroups] = useState<ReadonlyArray<string>>(p.initiallyClosedGroups);

  return {
    groups: getDistinctGroupNames(allSelectors).map((name) => {
      const isClosed = closedGroups.indexOf(name) !== -1;
      const selectors = allSelectors.filter((selector) => selector.groupName === (name || ""));
      return {
        name,
        isClosed,
        getGroupToggleButtonProps: () => ({
          onClick: () =>
            setClosedGroups(
              closedGroups.indexOf(name) >= 0 ? closedGroups.filter((g) => g !== name) : [...closedGroups, name]
            ),
        }),
        selectors,
      };
    }),
  };
}

function createPropertySelectorRenderInfos(
  params: Required<UsePropertiesSelectorParams>
): ReadonlyArray<UsePropertiesSelectorPropertySelectorRenderInfo> {
  const { productProperties, selectedProperties, includeHiddenProperties, propertyFormats, comparer } = params;

  // const sortedArray = R.sortBy((p) => p.sortNo, productProperties);
  const sortedArray = productProperties
    .slice()
    .sort((a, b) => (a.sort_no < b.sort_no ? -1 : a.sort_no > b.sort_no ? 1 : 0));

  const selectorDefinitions: ReadonlyArray<UsePropertiesSelectorPropertySelectorRenderInfo> = sortedArray
    .filter(
      (property: UsePropertiesSelectorProperty) =>
        includeHiddenProperties || PropertyFilter.isValid(selectedProperties, property.visibility_filter, comparer)
    )
    .map((property: UsePropertiesSelectorProperty) => {
      const selectedValue = PropertyValueSet.getValue(property.name, selectedProperties);
      const selectedValueItem =
        property.value &&
        property.value.find(
          (value: UsePropertiesSelectorPropertyValueItem) =>
            (value.value === undefined && selectedValue === undefined) ||
            (value.value && PropertyValue.equals(selectedValue, value.value, comparer))
        );

      let isValid: boolean;
      let defaultFormat: UsePropertiesSelectorAmountFormat = { unit: Unit.One, decimalCount: 2 };
      switch (getPropertyType(property.quantity)) {
        case "integer":
          isValid = selectedValueItem
            ? PropertyFilter.isValid(selectedProperties, selectedValueItem.validationFilter, comparer)
            : false;
          break;
        case "amount":
          defaultFormat =
            selectedValue && selectedValue.type === "amount"
              ? {
                  unit: selectedValue.value.unit,
                  decimalCount: selectedValue.value.decimalCount,
                }
              : defaultFormat;
          isValid =
            property.validation_filter &&
            PropertyFilter.isValid(selectedProperties, property.validation_filter, comparer);
          break;
        default:
          isValid = true;
      }

      // TODO: Better handling of format to use when the format is missing in the map
      const propertyFormat = propertyFormats[property.name] || defaultFormat;

      const isHidden = !PropertyFilter.isValid(selectedProperties, property.visibility_filter, comparer);
      // const label = translatePropertyName(property.name) + (includeCodes ? " (" + property.name + ")" : "");
      // const labelHover = translatePropertyLabelHover(property.name);

      const createSelectorRenderInfoParams: CreateSelectorRenderInfoParams = {
        property,
        selectedValueItem,
        propertyFormat,
      };

      const s: UsePropertiesSelectorPropertySelectorRenderInfo = {
        sortNo: property.sort_no,
        propertyName: property.name,
        groupName: property.group,
        isValid,
        isHidden,
        selectorRenderInfo: createSelectorRenderInfo(params, createSelectorRenderInfoParams),
      };
      return s;
    });

  return selectorDefinitions;
}

type CreateSelectorRenderInfoParams = {
  readonly property: UsePropertiesSelectorProperty;
  readonly selectedValueItem: UsePropertiesSelectorPropertyValueItem | undefined;
  readonly propertyFormat: UsePropertiesSelectorAmountFormat;
};

function createSelectorRenderInfo(
  params1: Required<UsePropertiesSelectorParams>,
  params: CreateSelectorRenderInfoParams
): SelectorRenderInfo {
  const {
    productProperties,
    comparer,
    autoSelectSingleValidValue,
    includeCodes,
    inputDebounceTime,
    valueMustBeNumericMessage,
    valueIsRequiredMessage,
    onChange,
    optionalProperties,
    filterPrettyPrint,
    units,
    unitsFormat,
    selectedProperties,
    onPropertyFormatChanged,
    onPropertyFormatCleared,
    lockSingleValidValue,
    readOnlyProperties,
  } = params1;
  const { property, propertyFormat, selectedValueItem } = params;

  const selectorType = getSelectorType(property);

  const readOnly = readOnlyProperties.indexOf(property.name) !== -1;

  // // Default true if not specified otherwise
  // const myAutoSelectSingleValidValue =
  //   autoSelectSingleValidValue === null || autoSelectSingleValidValue === undefined ? true : autoSelectSingleValidValue;

  const myAutoSelectSingleValidValue = autoSelectSingleValidValue;
  const propertyOnChange = handleChange(onChange, productProperties, myAutoSelectSingleValidValue, comparer);

  const fieldName = property.field_name || property.name;
  const propertyName = property.name;
  const validationFilter = property.validation_filter;
  const valueItems = property.value;

  const locked =
    myAutoSelectSingleValidValue || lockSingleValidValue
      ? shouldBeLocked(selectedValueItem, property, selectedProperties, comparer)
      : false;

  function onValueChange(newValue: PropertyValue.PropertyValue): void {
    propertyOnChange(
      newValue
        ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
        : PropertyValueSet.removeProperty(propertyName, selectedProperties),
      propertyName
    );
  }

  switch (selectorType) {
    case "TextBox": {
      return {
        type: "TextBox",
        getUseTextboxParams: () => ({
          propertyName,
          propertyValueSet: selectedProperties,
          readOnly,
          onValueChange,
          debounceTime: inputDebounceTime,
        }),
      };
    }

    case "RadioGroup":
      return {
        type: "RadioGroup",
      };
    // <RadioGroupPropertySelector
    //   propertyName={propertyName}
    //   propertyValueSet={selectedProperties}
    //   valueItems={
    //     valueItems &&
    //     valueItems.map(vi => ({
    //       value: vi.value,
    //       text: translatePropertyValue(propertyName, (vi.value
    //         ? PropertyValue.getInteger(vi.value)
    //         : undefined) as number),
    //       sortNo: vi.sort_no,
    //       validationFilter: vi.property_filter,
    //       image: vi.image
    //     }))
    //   }
    //   showCodes={includeCodes}
    //   filterPrettyPrint={filterPrettyPrint}
    //   onValueChange={onValueChange}
    //   readOnly={readOnly}
    //   locked={locked}
    // />

    case "Checkbox":
      return {
        type: "Checkbox",
        getUseCheckboxParams: () => ({
          propertyName,
          propertyValueSet: selectedProperties,
          valueItems,
          showCodes: includeCodes,
          filterPrettyPrint,
          onValueChange,
          readOnly: readOnly,
          locked,
        }),
      };

    case "ComboBox":
      return {
        type: "ComboBox",
        getUseComboboxParams: () => ({
          sortValidFirst: true,
          propertyName,
          propertyValueSet: selectedProperties,
          valueItems,
          showCodes: includeCodes,
          filterPrettyPrint,
          onValueChange,
          readOnly,
          locked,
        }),
      };
    case "AmountField": {
      return {
        type: "AmountField",
        getUseAmountParams: () => ({
          propertyName,
          propertyValueSet: selectedProperties,
          inputUnit: propertyFormat.unit,
          inputDecimalCount: propertyFormat.decimalCount,
          onFormatChanged: (unit: Unit.Unit<unknown>, decimalCount: number) =>
            onPropertyFormatChanged(propertyName, unit, decimalCount),
          onFormatCleared: () => onPropertyFormatCleared(propertyName),
          // onFormatSelectorToggled: (active: boolean) => onPropertyFormatSelectorToggled(propertyName, active),
          onValueChange,
          notNumericMessage: valueMustBeNumericMessage,
          fieldName: fieldName,
          // If it is optional then use blank required message
          isRequiredMessage:
            optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : valueIsRequiredMessage,
          validationFilter,
          filterPrettyPrint,
          readonly: readOnly,
          debounceTime: inputDebounceTime,
          unitsFormat,
          units,
        }),
      };
    }
    default:
      return exhaustiveCheck(selectorType, true);
  }
}

function getSelectorType(property: UsePropertiesSelectorProperty): UsePropertiesSelectorPropertySelectorType {
  if (property.quantity === "Text") {
    return "TextBox";
  } else if (property.quantity === "Discrete") {
    if (property.selector_type === "RadioGroup") {
      return "RadioGroup";
    } else if (property.selector_type === "Checkbox") {
      return "Checkbox";
    } else {
      return "ComboBox";
    }
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

function shouldBeLocked(
  selectedValueItem: UsePropertiesSelectorPropertyValueItem | undefined,
  productProperty: UsePropertiesSelectorProperty,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer
): boolean {
  const singleValidValue = getSingleValidValueOrUndefined(productProperty, properties, comparer);

  // getSingleValidValueOrUndefined only works on onChange.
  // Prevent locking when the sent in selectedValue isn't the singleValidValue
  if (singleValidValue && singleValidValue === selectedValueItem) {
    return true;
  }

  return false;
}

function handleChange(
  externalOnChange: UsePropertiesSelectorOnPropertiesChanged,
  productProperties: ReadonlyArray<UsePropertiesSelectorProperty>,
  autoSelectSingleValidValue: boolean,
  comparer: PropertyValue.Comparer
): (properties: PropertyValueSet.PropertyValueSet, propertyName: string) => void {
  return (properties: PropertyValueSet.PropertyValueSet, propertyName: string) => {
    if (!autoSelectSingleValidValue) {
      externalOnChange(properties, [propertyName]);
      return;
    }

    let lastProperties = properties;
    const changedProps = new Set([propertyName]);

    for (let i = 0; i < 4; i++) {
      for (const productProperty of productProperties) {
        if (productProperty.name === propertyName) {
          continue;
        }
        const propertyValueItem = getSingleValidValueOrUndefined(productProperty, properties, comparer);
        if (propertyValueItem) {
          properties = PropertyValueSet.set(productProperty.name, propertyValueItem.value, properties);
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

function getSingleValidValueOrUndefined(
  productProperty: UsePropertiesSelectorProperty,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer
): UsePropertiesSelectorPropertyValueItem | undefined {
  if (productProperty.quantity === "Discrete") {
    const validPropertyValueItems: Array<UsePropertiesSelectorPropertyValueItem> = [];
    for (const productValueItem of productProperty.value) {
      const isValid = PropertyFilter.isValid(properties, productValueItem.validationFilter, comparer);

      if (isValid) {
        validPropertyValueItems.push(productValueItem);
      }
    }

    return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : undefined;
  }

  return undefined;
}

function getDistinctGroupNames(
  productPropertiesArray: ReadonlyArray<UsePropertiesSelectorPropertySelectorRenderInfo>
): ReadonlyArray<string> {
  const groupNames: Array<string> = [];
  for (const property of productPropertiesArray) {
    // let groupName = property.groupName;
    if (isNullOrWhiteSpace(property.groupName)) {
      // groupName = "";
    }
    if (groupNames.indexOf(property.groupName) === -1) {
      groupNames.push(property.groupName);
    }
  }
  return groupNames;
}

function isNullOrWhiteSpace(str: string): boolean {
  return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, "").length < 1;
}

function paramsWithDefaults(params: UsePropertiesSelectorParams): Required<UsePropertiesSelectorParams> {
  // Do destructoring and set defaults
  const {
    productProperties,
    selectedProperties,
    filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
      PropertyFiltering.filterPrettyPrintIndented(
        // PropertyFiltering.FilterPrettyPrintMessagesEnglish,
        PropertyFiltering.buildEnglishMessages(params.unitsFormat),
        2,
        " ",
        propertyFilter,
        params.unitsFormat,
        params.unitLookup
      ),

    includeCodes = false,
    includeHiddenProperties = false,
    autoSelectSingleValidValue = true,
    lockSingleValidValue = false,
    onChange = (_a: PropertyValueSet.PropertyValueSet, _propertyName: ReadonlyArray<string>) => ({}),
    onPropertyFormatChanged = (_a: string, _b: Unit.Unit<unknown>, _c: number) => ({}),
    onPropertyFormatCleared = (_a: string) => ({}),

    valueMustBeNumericMessage = "value_must_be_numeric",
    valueIsRequiredMessage = "value_is_required",

    readOnlyProperties = [],
    optionalProperties = [],
    propertyFormats = {},

    inputDebounceTime = 350,

    unitsFormat,
    units,

    initiallyClosedGroups = [],

    unitLookup,
    comparer = PropertyValue.defaultComparer,
  } = params;

  return {
    productProperties,
    selectedProperties,
    filterPrettyPrint,
    includeCodes,
    includeHiddenProperties,
    autoSelectSingleValidValue,
    lockSingleValidValue,
    onChange,
    onPropertyFormatChanged,
    onPropertyFormatCleared,
    valueMustBeNumericMessage,
    valueIsRequiredMessage,
    readOnlyProperties,
    optionalProperties,
    propertyFormats,
    inputDebounceTime,
    initiallyClosedGroups,
    unitsFormat,
    units,
    unitLookup,
    comparer,
  };
}

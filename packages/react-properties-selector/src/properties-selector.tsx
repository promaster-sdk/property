import * as React from "react";
import { Units, Quantity, Unit, UnitFormat, UnitsFormat } from "uom";
import {
  PropertyValueSet,
  PropertyValue,
  PropertyFilter
} from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  PropertySelectorType,
  AmountFormat,
  OnPropertyFormatChanged,
  OnPropertyFormatCleared,
  OnPropertyFormatSelectorToggled,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  TranslatePropertyName,
  Property,
  TranslatePropertyLabelHover,
  TranslateGroupName,
  PropertySelectorRenderInfo,
  PropertyValueItem,
  ReactComponent,
  OnToggleGroupClosed,
  PropertyFormats,
  OnPropertiesChanged
} from "./types";
import {
  DefaultLayoutRenderer,
  LayoutRendererProps
} from "./default-layout-renderer";
import {
  GroupComponentProps,
  DefaultGroupComponent
} from "./default-group-component";
import {
  GroupItemComponentProps,
  DefaultGroupItemComponent
} from "./default-group-item-component";
import {
  PropertyLabelComponentProps,
  DefaultPropertyLabelComponent
} from "./default-property-label-component";
import {
  PropertySelectorProps,
  createPropertySelector
} from "./default-property-selector-component";

export interface PropertiesSelectorProps {
  // Required inputs
  readonly productProperties: ReadonlyArray<Property>;
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
  readonly onChange?: OnPropertiesChanged;
  readonly onPropertyFormatChanged?: OnPropertyFormatChanged;
  readonly onPropertyFormatCleared?: OnPropertyFormatCleared;
  readonly onPropertyFormatSelectorToggled?: OnPropertyFormatSelectorToggled;

  // Translations
  readonly translatePropertyName?: TranslatePropertyName;
  readonly translatePropertyValue?: TranslatePropertyValue;
  readonly translateValueMustBeNumericMessage?: TranslateNotNumericMessage;
  readonly translateValueIsRequiredMessage?: TranslateValueIsRequiredMessage;
  readonly translatePropertyLabelHover?: TranslatePropertyLabelHover;
  readonly translateGroupName?: TranslateGroupName;

  // Specifies property names of properties that should be read-only
  readonly readOnlyProperties?: ReadonlyArray<string>;
  // Specifies property names of properties that should be optional (only for amounts for now)
  readonly optionalProperties?: ReadonlyArray<string>;
  // Specifies input format per property name for entering amount properties (measure unit and decimal count)
  readonly propertyFormats?: PropertyFormats;

  // Debounce value for inputs in ms. Defaults to 350.
  readonly inputDebounceTime?: number;

  // Group handling
  readonly closedGroups?: ReadonlyArray<string>;
  readonly onToggleGroupClosed?: OnToggleGroupClosed;

  // Use customUnits
  readonly unitsFormat?: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  readonly units?: {
    readonly [key: string]: Unit.Unit;
  };

  // Override layout
  readonly LayoutRenderer?: (props: LayoutRendererProps) => JSX.Element;
  readonly GroupComponent?: ReactComponent<GroupComponentProps>;
  readonly GroupItemComponent?: ReactComponent<GroupItemComponentProps>;
  readonly PropertySelectorComponent?: ReactComponent<PropertySelectorProps>;
  readonly PropertyLabelComponent?: ReactComponent<PropertyLabelComponentProps>;

  // Comparer
  readonly comparer?: PropertyValue.Comparer;
}

export function PropertiesSelector(
  props: PropertiesSelectorProps
): React.ReactElement<LayoutRendererProps> {
  // Do destructoring and set defaults
  const {
    productProperties,
    selectedProperties,
    filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
      PropertyFiltering.filterPrettyPrintIndented(
        PropertyFiltering.FilterPrettyPrintMessagesEnglish,
        2,
        " ",
        propertyFilter
      ),

    includeCodes = false,
    includeHiddenProperties = false,
    autoSelectSingleValidValue = true,
    lockSingleValidValue = false,
    onChange = (
      _a: PropertyValueSet.PropertyValueSet,
      _propertyName: ReadonlyArray<string>
    ) => {}, //tslint:disable-line
    onPropertyFormatChanged = (
      _a: string,
      // tslint:disable-next-line:no-any
      _b: Unit.Unit<any>,
      _c: number
    ) => {}, //tslint:disable-line
    onPropertyFormatCleared = (_a: string) => {}, //tslint:disable-line
    onPropertyFormatSelectorToggled = () => {}, //tslint:disable-line

    translatePropertyName = (a: string) => a,
    translatePropertyValue = (a: string, b: number | undefined) => `${a}_${b}`,
    translateValueMustBeNumericMessage = () => "value_must_be_numeric",
    translateValueIsRequiredMessage = () => "value_is_required",
    translatePropertyLabelHover = () => "translatePropertyLabelHover",
    translateGroupName = (a: string) => a,

    readOnlyProperties = [],
    optionalProperties = [],
    propertyFormats = {},

    inputDebounceTime = 350,

    unitsFormat = UnitsFormat,
    units = Units,

    closedGroups = [],
    onToggleGroupClosed = () => {}, // tslint:disable-line

    LayoutRenderer = DefaultLayoutRenderer,
    GroupComponent = DefaultGroupComponent,
    GroupItemComponent = DefaultGroupItemComponent,
    PropertySelectorComponent = createPropertySelector({}),
    PropertyLabelComponent = DefaultPropertyLabelComponent,

    comparer = PropertyValue.defaultComparer
  } = props;

  const selectors = createPropertySelectorRenderInfos(
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
    onPropertyFormatSelectorToggled,

    translatePropertyName,
    translatePropertyValue,
    translateValueMustBeNumericMessage,
    translateValueIsRequiredMessage,
    translatePropertyLabelHover,

    readOnlyProperties,
    optionalProperties,
    propertyFormats,

    inputDebounceTime,
    unitsFormat,
    units,

    comparer
  );

  return LayoutRenderer({
    selectors: selectors,
    translateGroupName: translateGroupName,
    closedGroups: closedGroups,
    onToggleGroupClosed: onToggleGroupClosed,
    GroupComponent: GroupComponent,
    GroupItemComponent: GroupItemComponent,
    PropertySelectorComponent: PropertySelectorComponent,
    PropertyLabelComponent: PropertyLabelComponent
  });
}

function createPropertySelectorRenderInfos(
  productProperties: ReadonlyArray<Property>,
  selectedProperties: PropertyValueSet.PropertyValueSet,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
  includeCodes: boolean,
  includeHiddenProperties: boolean,
  autoSelectSingleValidValue: boolean,
  lockSingleValidValue: boolean,
  onChange: OnPropertiesChanged,
  onPropertyFormatChanged: OnPropertyFormatChanged,
  onPropertyFormatCleared: OnPropertyFormatCleared,
  onPropertyFormatSelectorToggled: OnPropertyFormatSelectorToggled,
  translatePropertyName: TranslatePropertyName,
  translatePropertyValue: TranslatePropertyValue,
  translateValueMustBeNumericMessage: TranslateNotNumericMessage,
  translateValueIsRequiredMessage: TranslateValueIsRequiredMessage,
  translatePropertyLabelHover: TranslatePropertyLabelHover,
  readOnlyProperties: ReadonlyArray<string>,
  optionalProperties: ReadonlyArray<string>,
  propertyFormats: { readonly [key: string]: AmountFormat },
  inputDebounceTime: number,
  unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  },
  units: { readonly [key: string]: Unit.Unit },
  comparer: PropertyValue.Comparer
): ReadonlyArray<PropertySelectorRenderInfo> {
  // Default true if not specified otherwise
  autoSelectSingleValidValue =
    autoSelectSingleValidValue === null ||
    autoSelectSingleValidValue === undefined
      ? true
      : autoSelectSingleValidValue;

  // const sortedArray = R.sortBy((p) => p.sortNo, productProperties);
  const sortedArray = productProperties
    .slice()
    .sort((a, b) =>
      a.sort_no < b.sort_no ? -1 : a.sort_no > b.sort_no ? 1 : 0
    );

  const selectorDefinitions: ReadonlyArray<
    PropertySelectorRenderInfo
  > = sortedArray
    .filter(
      (property: Property) =>
        includeHiddenProperties ||
        PropertyFilter.isValid(
          selectedProperties,
          property.visibility_filter,
          comparer
        )
    )
    .map((property: Property) => {
      const selectedValue = PropertyValueSet.getValue(
        property.name,
        selectedProperties
      );
      const selectedValueItem =
        property.value &&
        property.value.find(
          (value: PropertyValueItem) =>
            (value.value === undefined && selectedValue === undefined) ||
            (value.value &&
              PropertyValue.equals(selectedValue, value.value, comparer))
        );

      let isValid: boolean;
      let defaultFormat: AmountFormat = { unit: Units.One, decimalCount: 2 };
      switch (getPropertyType(property.quantity)) {
        case "integer":
          isValid = selectedValueItem
            ? PropertyFilter.isValid(
                selectedProperties,
                selectedValueItem.property_filter,
                comparer
              )
            : false;
          break;
        case "amount":
          defaultFormat =
            selectedValue && selectedValue.type === "amount"
              ? {
                  unit: selectedValue.value.unit,
                  decimalCount: selectedValue.value.decimalCount
                }
              : defaultFormat;
          isValid =
            property.validation_filter &&
            PropertyFilter.isValid(
              selectedProperties,
              property.validation_filter,
              comparer
            );
          break;
        default:
          isValid = true;
      }

      const isReadOnly = readOnlyProperties.indexOf(property.name) !== -1;
      // TODO: Better handling of format to use when the format is missing in the map
      const propertyFormat = propertyFormats[property.name] || defaultFormat;

      const isHidden = !PropertyFilter.isValid(
        selectedProperties,
        property.visibility_filter,
        comparer
      );
      const label =
        translatePropertyName(property.name) +
        (includeCodes ? " (" + property.name + ")" : "");
      const labelHover = translatePropertyLabelHover(property.name);

      const selectorType = getSelectorType(property);

      const propertySelectorComponentProps: PropertySelectorProps = {
        selectorType: selectorType,
        fieldName: property.field_name || property.name,
        propertyName: property.name,
        quantity: property.quantity,
        validationFilter: property.validation_filter,
        valueItems: property.value,
        selectedProperties,
        includeCodes,
        optionalProperties,
        onChange: handleChange(
          onChange,
          productProperties,
          autoSelectSingleValidValue,
          comparer
        ),
        onPropertyFormatChanged,
        onPropertyFormatCleared,
        onPropertyFormatSelectorToggled,
        filterPrettyPrint,
        propertyFormat,
        readOnly: isReadOnly,
        locked:
          autoSelectSingleValidValue || lockSingleValidValue
            ? shouldBeLocked(
                selectedValueItem,
                property,
                selectedProperties,
                comparer
              )
            : false,
        translatePropertyValue,
        translateValueMustBeNumericMessage: translateValueMustBeNumericMessage,
        translateValueIsRequiredMessage,
        inputDebounceTime,
        unitsFormat,
        units
      };

      const propertyLabelComponentProps: PropertyLabelComponentProps = {
        propertyName: property.name,
        selectorIsValid: isValid,
        selectorIsHidden: isHidden,
        selectorLabel: label,
        translatePropertyLabelHover
      };

      return {
        sortNo: property.sort_no,
        propertyName: property.name,
        groupName: property.group,

        isValid: isValid,
        isHidden: isHidden,

        label: label,
        labelHover: labelHover,

        selectorComponentProps: propertySelectorComponentProps,
        labelComponentProps: propertyLabelComponentProps
      };
    });

  return selectorDefinitions;
}

function getSelectorType(property: Property): PropertySelectorType {
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

function getPropertyType(
  quantity: Quantity.Quantity
): PropertyValue.PropertyType {
  switch (quantity) {
    case "Text":
      return "text";
    case "Discrete":
      return "integer";
    default:
      return "amount";
  }
}

function getSingleValidValueOrUndefined(
  productProperty: Property,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer
): PropertyValueItem | undefined {
  if (productProperty.quantity === "Discrete") {
    const validPropertyValueItems: PropertyValueItem[] = [];
    for (let productValueItem of productProperty.value) {
      const isValid = PropertyFilter.isValid(
        properties,
        productValueItem.property_filter,
        comparer
      );

      if (isValid) {
        validPropertyValueItems.push(productValueItem);
      }
    }

    return validPropertyValueItems.length === 1
      ? validPropertyValueItems[0]
      : undefined;
  }

  return undefined;
}

function shouldBeLocked(
  selectedValueItem: PropertyValueItem | undefined,
  productProperty: Property,
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer
): boolean {
  const singleValidValue = getSingleValidValueOrUndefined(
    productProperty,
    properties,
    comparer
  );

  // getSingleValidValueOrUndefined only works on onChange.
  // Prevent locking when the sent in selectedValue isn't the singleValidValue
  if (singleValidValue && singleValidValue === selectedValueItem) {
    return true;
  }

  return false;
}

function handleChange(
  externalOnChange: OnPropertiesChanged,
  productProperties: ReadonlyArray<Property>,
  autoSelectSingleValidValue: boolean,
  comparer: PropertyValue.Comparer
): (
  properties: PropertyValueSet.PropertyValueSet,
  propertyName: string
) => void {
  return (
    properties: PropertyValueSet.PropertyValueSet,
    propertyName: string
  ) => {
    if (!autoSelectSingleValidValue) {
      externalOnChange(properties, [propertyName]);
      return;
    }

    let lastProperties = properties;
    // tslint:disable-next-line:readonly-keyword
    const changedProps = new Set([propertyName]);

    for (let i = 0; i < 4; i++) {
      for (let productProperty of productProperties) {
        if (productProperty.name === propertyName) {
          continue;
        }
        const propertyValueItem = getSingleValidValueOrUndefined(
          productProperty,
          properties,
          comparer
        );
        if (propertyValueItem) {
          properties = PropertyValueSet.set(
            productProperty.name,
            propertyValueItem.value,
            properties
          );
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

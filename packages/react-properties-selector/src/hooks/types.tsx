import { Unit, UnitFormat } from "uom";
import { PropertyValueSet, PropertyValue, PropertyFilter } from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  UseAmountPropertySelectorParams,
  UseCheckboxPropertySelectorParams,
  UseComboboxPropertySelectorParams,
  UseTextboxPropertySelectorParams,
} from "@promaster-sdk/react-property-selectors";

export type UsePropertiesSelectorPropertySelectorProps = {
  readonly fieldName: string;
  readonly propertyName: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly valueItems: ReadonlyArray<UsePropertiesSelectorPropertyValueItem>;
  readonly selectedProperties: PropertyValueSet.PropertyValueSet;
  readonly includeCodes: boolean;
  readonly optionalProperties: ReadonlyArray<string>;
  readonly onChange: UsePropertiesSelectorPropertySelectionOnChange;
  readonly onPropertyFormatChanged: UsePropertiesSelectorOnPropertyFormatChanged;
  readonly onPropertyFormatCleared: UsePropertiesSelectorOnPropertyFormatCleared;
  readonly onPropertyFormatSelectorToggled: UsePropertiesSelectorOnPropertyFormatSelectorToggled;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly propertyFormat: UsePropertiesSelectorAmountFormat;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly translatePropertyValue: UsePropertiesSelectorTranslatePropertyValue;
  readonly translateValueMustBeNumericMessage: UsePropertiesSelectorTranslateNotNumericMessage;
  readonly translateValueIsRequiredMessage: UsePropertiesSelectorTranslateValueIsRequiredMessage;
  readonly inputDebounceTime: number;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  readonly units: Unit.UnitMap;
};

export type UsePropertiesSelectorAmountFormat = {
  readonly unit: Unit.Unit<unknown>;
  readonly decimalCount: number;
};
export type UsePropertiesSelectorPropertySelectionOnChange = (
  properties: PropertyValueSet.PropertyValueSet,
  propertyNames: string
) => void;

export type UsePropertiesSelectorOnPropertiesChanged = (
  properties: PropertyValueSet.PropertyValueSet,
  propertyNames: ReadonlyArray<string>
) => void;

export type UsePropertiesSelectorOnPropertyFormatChanged = (
  propertyName: string,
  unit: Unit.Unit<unknown>,
  decimalCount: number
) => void;
export type UsePropertiesSelectorOnPropertyFormatCleared = (propertyName: string) => void;
export type UsePropertiesSelectorOnPropertyFormatSelectorToggled = (propertyName: string, active: boolean) => void;

export type UsePropertiesSelectorTranslatePropertyValue = (propertyName: string, value: number | undefined) => string;
export type UsePropertiesSelectorTranslateNotNumericMessage = () => string;
export type UsePropertiesSelectorTranslateValueIsRequiredMessage = () => string;

export type UsePropertiesSelectorOnToggleGroupClosed = (groupName: string) => void;

// Defines information to render one selector
export type UsePropertiesSelectorPropertySelectorRenderInfo = {
  // This is information that the layout component can use
  readonly sortNo: number;
  readonly groupName: string;
  readonly propertyName: string;

  // This flag tells if the selector currently holds a valid selection
  readonly isValid: boolean;

  // If includeHiddenProperties was specified, the selector may have been rendered even if it is supposed to be hidden
  // This flag tells if is was supposed to be hidden
  readonly isHidden: boolean;

  // Props that are used by the components that render the actual property selector and it's label
  // readonly selectorComponentProps: UsePropertiesSelectorPropertySelectorProps;

  // readonly selectorType: UsePropertiesSelectorPropertySelectorType;
  readonly selectorRenderInfo: SelectorRenderInfo;
};

export type SelectorRenderInfo =
  | {
      readonly type: "ComboBox";
      readonly selectorComponentProps: UsePropertiesSelectorPropertySelectorProps;
      readonly getUseComboboxParams: () => UseComboboxPropertySelectorParams;
    }
  | {
      readonly type: "RadioGroup";
      readonly selectorComponentProps: UsePropertiesSelectorPropertySelectorProps;
    }
  | {
      readonly type: "Checkbox";
      readonly selectorComponentProps: UsePropertiesSelectorPropertySelectorProps;
      readonly getUseCheckboxParams: () => UseCheckboxPropertySelectorParams;
    }
  | {
      readonly type: "AmountField";
      readonly selectorComponentProps: UsePropertiesSelectorPropertySelectorProps;
      readonly getUseAmountParams: () => UseAmountPropertySelectorParams;
    }
  | {
      readonly type: "TextBox";
      readonly selectorComponentProps: UsePropertiesSelectorPropertySelectorProps;
      readonly getUseTextboxParams: () => UseTextboxPropertySelectorParams;
    };

export type UsePropertiesSelectorPropertySelectorType =
  | "ComboBox"
  | "RadioGroup"
  | "Checkbox"
  | "AmountField"
  | "TextBox";

/**
 * This interface has keys with the same names as returned by promaster-api, plus selector_type for choosing appearance of the selector
 */
export interface UsePropertiesSelectorProperty {
  readonly selector_type?: UsePropertiesSelectorPropertySelectorType;
  readonly field_name?: string;
  readonly sort_no: number;
  readonly name: string;
  readonly group: string;
  readonly quantity: string;
  readonly validation_filter: PropertyFilter.PropertyFilter;
  readonly visibility_filter: PropertyFilter.PropertyFilter;
  readonly value: ReadonlyArray<UsePropertiesSelectorPropertyValueItem>;
}

/**
 * This interface has keys with the same names as returned by promaster-api.
 */
export interface UsePropertiesSelectorPropertyValueItem {
  readonly sort_no: number;
  readonly value: PropertyValue.PropertyValue;
  readonly property_filter: PropertyFilter.PropertyFilter;
  readonly image?: string;
}

export interface UsePropertiesSelectorPropertyFormats {
  readonly [key: string]: UsePropertiesSelectorAmountFormat;
}

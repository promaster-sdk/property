import * as React from "react";
import {Unit, PropertyValueSet, PropertyValue, PropertyFilter, Quantity} from "@promaster/promaster-primitives";
import {PropertySelectorComponentProps} from "./default-property-selector-component";
import {PropertyLabelComponentProps} from "./default-property-label-component";
import {AmountPropertySelectorStyles, ComboboxPropertySelectorStyles, TextboxPropertySelectorStyles} from "../property-selectors/index";

export type AmountFormat = {unit: Unit.Unit<any>, decimalCount: number};
export type PropertySelectionOnChange = (properties: PropertyValueSet.PropertyValueSet) => void;
export type OnPropertyFormatChanged = (propertyName: string, unit: Unit.Unit<any>, decimalCount: number) => void
export type OnPropertyFormatCleared = (propertyName: string) => void

export type TranslatePropertyName = (propertyName: string) => string;
export type TranslatePropertyValue = (propertyName: string, value: number | undefined) => string;
export type TranslateNotNumericMessage = () => string;
export type TranslateValueIsRequiredMessage = () => string;

export type TranslatePropertyLabelHover = (propertyName: string) => string;
export type TranslateGroupName = (groupName: string) => string;
export type OnToggleGroupClosed = (groupName: string) => void;

export type ReactComponent<T> = React.ComponentClass<T> | React.StatelessComponent<T>;

// Defines information to render one selector
export interface PropertySelectorRenderInfo {

	// This is information that the layout component can use
	readonly sortNo: number,
	readonly groupName: string,
	readonly propertyName: string,

	// This flag tells if the selector currently holds a valid selection
	readonly isValid: boolean,

	// If includeHiddenProperties was specified, the selector may have been rendered even if it is supposed to be hidden
	// This flag tells if is was supposed to be hidden
	readonly isHidden: boolean,

	// A default label is provided here that adheres to showCodes,
	// the layout component can of course choose not to use this label
	readonly label: string,
  readonly labelHover: string,

  // Props that are used by the components that render the actual property selector and it's label
  readonly selectorComponentProps: PropertySelectorComponentProps,
  readonly labelComponentProps: PropertyLabelComponentProps,

}

/**
 * This interface has keys with the same names as returned by promaster-api.
 */
export interface Property {
	readonly sort_no: number,
	readonly name: string,
	readonly group: string,
	readonly quantity: Quantity.Quantity,
	readonly validation_filter: PropertyFilter.PropertyFilter,
	readonly visibility_filter: PropertyFilter.PropertyFilter,
	readonly value: ReadonlyArray<PropertyValueItem>,
}

/**
 * This interface has keys with the same names as returned by promaster-api.
 */
export interface PropertyValueItem {
	readonly sort_no: number,
	readonly value: PropertyValue.PropertyValue,
	readonly property_filter: PropertyFilter.PropertyFilter,
  readonly image?: string,
}

export interface PropertySelectorStyles {
  amountPropertySelectorStyles?: AmountPropertySelectorStyles,
  comboboxPropertySelectorStyles?: ComboboxPropertySelectorStyles,
  textboxPropertySelectorStyles?: TextboxPropertySelectorStyles
}

import * as React from "react";
import {Unit, PropertyValueSet, QuantityType, PropertyValue, PropertyFilter} from "promaster-primitives";

export type AmountFormat = {unit: Unit<any>, decimalCount: number};
export type PropertySelectionOnChange = (properties: PropertyValueSet) => void;
export type OnPropertyFormatChanged = (propertyName: string, unit: Unit<any>, decimalCount: number) => void

export type TranslatePropertyName = (propertyName: string) => string;
export type TranslatePropertyValue = (propertyName: string, value: number | null) => string;
export type TranslateNotNumericMessage = () => string;
export type TranslateValueIsRequiredMessage = () => string;

// Defines one already rendered selector that should be layed out by the
// layout component. Technically it contains a react element and some
// meta data.
export interface RenderedPropertySelector {

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

	// This is the property selector that should be
	// layed out by the layout component
	readonly renderedSelectorElement: React.ReactElement<{}>,

}

export interface Property {
	readonly sortNo: number,
	readonly name: string,
	readonly group: string,
	readonly quantity: QuantityType,
	readonly validationFilter: PropertyFilter,
	readonly visibilityFilter: PropertyFilter,
	readonly valueItems: Array<PropertyValueItem>,
}

export interface PropertyValueItem {
	readonly value: PropertyValue,
	readonly sortNo: number,
	readonly validationFilter: PropertyFilter,
}



import { PropertyValueSet, Quantity, PropertyValue, PropertyFilter } from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import { PropertySelectionOnChange, AmountFormat, OnPropertyFormatChanged, OnPropertyFormatCleared, TranslatePropertyValue, TranslateNotNumericMessage, TranslateValueIsRequiredMessage, PropertyValueItem, PropertySelectorStyles } from "./types";
export interface PropertySelectorComponentProps {
    readonly propertyName: string;
    readonly quantity: Quantity.Quantity;
    readonly validationFilter: PropertyFilter.PropertyFilter;
    readonly valueItems: Array<PropertyValueItem>;
    readonly selectedValue: PropertyValue.PropertyValue;
    readonly selectedProperties: PropertyValueSet.PropertyValueSet;
    readonly includeCodes: boolean;
    readonly optionalProperties: Array<string>;
    readonly onChange: PropertySelectionOnChange;
    readonly onPropertyFormatChanged: OnPropertyFormatChanged;
    readonly onPropertyFormatCleared: OnPropertyFormatCleared;
    readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
    readonly propertyFormat: AmountFormat;
    readonly readOnly: boolean;
    readonly locked: boolean;
    readonly translatePropertyValue: TranslatePropertyValue;
    readonly translateValueMustBeNumericMessage: TranslateNotNumericMessage;
    readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage;
    readonly styles: PropertySelectorStyles;
    readonly inputDebounceTime?: number;
}
export declare function DefaultPropertySelectorComponent({propertyName, quantity, validationFilter, valueItems, selectedValue, selectedProperties, includeCodes, optionalProperties, onChange, onPropertyFormatChanged, onPropertyFormatCleared, filterPrettyPrint, propertyFormat, readOnly, locked, translatePropertyValue, translateValueMustBeNumericMessage, translateValueIsRequiredMessage, styles, inputDebounceTime}: PropertySelectorComponentProps): any;

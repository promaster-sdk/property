import { PropertyValueSet, Quantity, PropertyValue, PropertyFilter } from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import { PropertySelectionOnChange, AmountFormat, OnPropertyFormatChanged, TranslatePropertyValue, TranslateNotNumericMessage, TranslateValueIsRequiredMessage, PropertyValueItem, PropertySelectorStyles } from "./types";
export interface PropertySelectorComponentProps {
    propertyName: string;
    quantity: Quantity.Quantity;
    validationFilter: PropertyFilter.PropertyFilter;
    valueItems: Array<PropertyValueItem>;
    selectedValue: PropertyValue.PropertyValue;
    selectedProperties: PropertyValueSet.PropertyValueSet;
    includeCodes: boolean;
    optionalProperties: Array<string>;
    onChange: PropertySelectionOnChange;
    onPropertyFormatChanged: OnPropertyFormatChanged;
    filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
    propertyFormat: AmountFormat;
    readOnly: boolean;
    locked: boolean;
    translatePropertyValue: TranslatePropertyValue;
    translateValueMustBeNumericMessage: TranslateNotNumericMessage;
    translateValueIsRequiredMessage: TranslateValueIsRequiredMessage;
    styles: PropertySelectorStyles;
}
export declare function DefaultPropertySelectorComponent({propertyName, quantity, validationFilter, valueItems, selectedValue, selectedProperties, includeCodes, optionalProperties, onChange, onPropertyFormatChanged, filterPrettyPrint, propertyFormat, readOnly, locked, translatePropertyValue, translateValueMustBeNumericMessage, translateValueIsRequiredMessage, styles}: PropertySelectorComponentProps): any;

/// <reference types="react" />
import * as React from "react";
import { Unit, PropertyValueSet, PropertyValue, PropertyFilter, Quantity } from "promaster-primitives";
export declare type AmountFormat = {
    unit: Unit.Unit<any>;
    decimalCount: number;
};
export declare type PropertySelectionOnChange = (properties: PropertyValueSet.PropertyValueSet) => void;
export declare type OnPropertyFormatChanged = (propertyName: string, unit: Unit.Unit<any>, decimalCount: number) => void;
export declare type TranslatePropertyName = (propertyName: string) => string;
export declare type TranslatePropertyValue = (propertyName: string, value: number | null) => string;
export declare type TranslateNotNumericMessage = () => string;
export declare type TranslateValueIsRequiredMessage = () => string;
export interface RenderedPropertySelector {
    readonly sortNo: number;
    readonly groupName: string;
    readonly propertyName: string;
    readonly isValid: boolean;
    readonly isHidden: boolean;
    readonly label: string;
    readonly renderedSelectorElement: React.ReactElement<{}>;
}
export interface Property {
    readonly sortNo: number;
    readonly name: string;
    readonly group: string;
    readonly quantity: Quantity.Quantity;
    readonly validationFilter: PropertyFilter.PropertyFilter;
    readonly visibilityFilter: PropertyFilter.PropertyFilter;
    readonly valueItems: Array<PropertyValueItem>;
}
export interface PropertyValueItem {
    readonly value: PropertyValue.PropertyValue;
    readonly sortNo: number;
    readonly validationFilter: PropertyFilter.PropertyFilter;
}

/// <reference types="react" />
import * as React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "promaster-primitives";
import { PropertyFiltering } from "promaster-portable";
import { Styles } from "./combobox-property-selector-styles";
export interface ComboBoxPropertyValueItem {
    readonly value: PropertyValue.PropertyValue | undefined;
    readonly sortNo: number;
    readonly text: string;
    readonly validationFilter: PropertyFilter.PropertyFilter;
}
export interface ComboboxPropertySelectorProps {
    readonly sortValidFirst: boolean;
    readonly propertyName: string;
    readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
    readonly valueItems: ReadonlyArray<ComboBoxPropertyValueItem>;
    readonly showCodes: boolean;
    readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
    readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
    readonly readOnly: boolean;
    readonly locked: boolean;
    readonly classes: Styles;
}
export declare function ComboboxPropertySelector({sortValidFirst, propertyName, propertyValueSet, valueItems, showCodes, onValueChange, filterPrettyPrint, readOnly, locked, classes}: ComboboxPropertySelectorProps): React.ReactElement<ComboboxPropertySelectorProps>;

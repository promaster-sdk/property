/// <reference types="react" />
import * as React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import { ComboboxPropertySelectorStyles } from "./combobox-property-selector-styles";
export interface ComboBoxPropertyValueItem {
    readonly value: PropertyValue.PropertyValue | undefined | null;
    readonly sortNo: number;
    readonly text: string;
    readonly image?: string;
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
    readonly styles?: ComboboxPropertySelectorStyles;
}
export declare function ComboboxPropertySelector({sortValidFirst, propertyName, propertyValueSet, valueItems, showCodes, onValueChange, filterPrettyPrint, readOnly, locked, styles}: ComboboxPropertySelectorProps): React.ReactElement<ComboboxPropertySelectorProps>;

/// <reference types="react" />
import * as React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "promaster-primitives";
import { PropertyFiltering } from "promaster-portable";
export interface ComboBoxPropertyValueItem {
    readonly value: PropertyValue.PropertyValue | null;
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
    readonly classNames: ComboboxPropertySelectorClassNames;
}
export interface ComboboxPropertySelectorClassNames {
    readonly select: string;
    readonly selectInvalid: string;
    readonly selectLocked: string;
    readonly selectInvalidLocked: string;
    readonly option: string;
    readonly optionInvalid: string;
}
export declare function ComboboxPropertySelector({sortValidFirst, propertyName, propertyValueSet, valueItems, showCodes, onValueChange, filterPrettyPrint, readOnly, locked, classNames}: ComboboxPropertySelectorProps): React.ReactElement<ComboboxPropertySelectorProps>;

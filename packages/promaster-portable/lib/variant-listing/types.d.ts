import { Quantity, PropertyFilter, PropertyValue } from "@promaster/promaster-primitives";
export interface Property {
    readonly sortNo: number;
    readonly name: string;
    readonly quantity: Quantity.Quantity;
    readonly validationFilter: PropertyFilter.PropertyFilter;
    readonly valueItems: PropertyValueItem[];
    readonly defaultValues: PropertyDefaultValue[];
}
export declare type PropertyValueItem = {
    readonly value: PropertyValue.PropertyValue;
    readonly sortNo: number;
    readonly validationFilter: PropertyFilter.PropertyFilter;
};
export declare type PropertyDefaultValue = {
    readonly value: PropertyValue.PropertyValue;
    readonly sortNo: number;
    readonly propertyFilter: PropertyFilter.PropertyFilter;
};

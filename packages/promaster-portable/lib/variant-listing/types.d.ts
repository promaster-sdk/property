<<<<<<< HEAD
import { Quantity, PropertyFilter, PropertyValue } from "promaster-primitives";
=======
import { Quantity, PropertyFilter, PropertyValue } from "@promaster/promaster-primitives";
>>>>>>> d6a67ebc4d2fd52dcfdc3d9963e3aa00d0c40ad1
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

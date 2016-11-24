import {Quantity, PropertyFilter, PropertyValue} from "promaster-primitives";

export interface Property {
  readonly sortNo: number,
  readonly name: string,
  readonly quantity: Quantity.Quantity,
  readonly validationFilter: PropertyFilter.PropertyFilter,
  readonly valueItems: PropertyValueItem[],
  readonly defaultValues: PropertyDefaultValue[],
}

export type PropertyValueItem = {
  readonly value: PropertyValue.PropertyValue,
  readonly sortNo: number,
  readonly validationFilter: PropertyFilter.PropertyFilter,
}

export type PropertyDefaultValue = {
  readonly value: PropertyValue.PropertyValue,
  readonly sortNo: number,
  readonly propertyFilter: PropertyFilter.PropertyFilter
}

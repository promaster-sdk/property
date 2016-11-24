import {Quantity, PropertyFilter, PropertyValue} from "promaster-primitives";

export interface Property {
  readonly sortNo: number,
  readonly name: string,
  readonly group: string,
  readonly quantity: Quantity.Quantity,
  readonly text: string,
  readonly validationFilter: PropertyFilter.PropertyFilter,
  readonly visibilityFilter: PropertyFilter.PropertyFilter,
  readonly valueItems: PropertyValueItem[],
  readonly defaultValues: PropertyDefaultValue[],
  readonly translations?: PropertyTranslation[]
}

export type PropertyValueItem = {
  readonly value: PropertyValue.PropertyValue,
  readonly text: string,
  readonly sortNo: number,
  readonly validationFilter: PropertyFilter.PropertyFilter,
  readonly translations?: PropertyTranslation[]
}

export type PropertyDefaultValue = {
  readonly value: PropertyValue.PropertyValue,
  readonly sortNo: number,
  readonly propertyFilter: PropertyFilter.PropertyFilter
}

export type PropertyTranslation = {
  readonly language: string,
  readonly translation: string,
  readonly type: string
}

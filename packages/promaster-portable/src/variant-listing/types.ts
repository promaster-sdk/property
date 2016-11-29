import {Quantity, PropertyFilter, PropertyValue} from "@promaster/promaster-primitives";

export interface ProductProperty {
  readonly sort_no: number;
  readonly name: string;
  readonly quantity: Quantity.Quantity;
  readonly validation_filter: PropertyFilter.PropertyFilter;
  readonly value: Array<ProductPropertyValue>;
  readonly def_value: PropertyDefaultValue[];
}

export type ProductPropertyValue = {
  readonly value: PropertyValue.PropertyValue,
  readonly property_filter: PropertyFilter.PropertyFilter,
  readonly description: string,
}

export type PropertyDefaultValue = {
  readonly value: PropertyValue.PropertyValue,
}

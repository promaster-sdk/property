import {
  Quantity,
  PropertyValueSet,
  PropertyFilter,
  PropertyValue
} from "@promaster/promaster-primitives";

export interface ProductProperty {
  readonly sort_no: number;
  readonly name: string;
  readonly quantity: Quantity.Quantity;
  readonly validation_filter: PropertyFilter.PropertyFilter;
  readonly visibility_filter: PropertyFilter.PropertyFilter;
  readonly value: Array<ProductPropertyValue>;
  readonly def_value: PropertyDefaultValue[];
}

export type ProductPropertyValue = {
  readonly value: PropertyValue.PropertyValue;
  readonly property_filter: PropertyFilter.PropertyFilter;
  readonly description: string;
};

export type PropertyDefaultValue = {
  readonly value: PropertyValue.PropertyValue;
};

export interface VariantUrlList {
  readonly variants: PropertyValueSet.PropertyValueSet;
  readonly url: string;
}

export interface ExtendedVariants {
  readonly variants: VariantUrlList[];
  readonly pruned: boolean;
}

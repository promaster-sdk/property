import { PropertyValueSet, PropertyFilter, PropertyValue } from "@promaster-sdk/property";

export interface ProductProperty {
  readonly sort_no: number;
  readonly name: string;
  readonly quantity: string;
  readonly validation_filter: PropertyFilter.PropertyFilter;
  readonly visibility_filter: PropertyFilter.PropertyFilter;
  readonly value: ReadonlyArray<ProductPropertyValue>;
  readonly def_value: ReadonlyArray<PropertyDefaultValue>;
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
  readonly variants: ReadonlyArray<VariantUrlList>;
  readonly pruned: boolean;
}

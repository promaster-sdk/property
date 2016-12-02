import { PropertyValueSet } from "@promaster/promaster-primitives";
import { ExtendedVariants, ProductProperty, VariantUrlList } from "./types";
export declare function buildAllPropertyValueSets(explicitPropertyValueSet: PropertyValueSet.PropertyValueSet, variableProperties: ProductProperty[], allProperties: ProductProperty[]): VariantUrlList[];
export declare function buildAllPropertyValueSetsExtended(explicitPropertyValueSet: PropertyValueSet.PropertyValueSet, variableProperties: ProductProperty[], allProperties: ProductProperty[], limit: number): ExtendedVariants;

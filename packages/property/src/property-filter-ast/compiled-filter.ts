import * as PropertyValueSet from "../property-value-set";
import * as PropertyValue from "../property-value";

export type CompiledFilterFunction = (
  properties: PropertyValueSet.PropertyValueSet,
  comparer: PropertyValue.Comparer
) => boolean;

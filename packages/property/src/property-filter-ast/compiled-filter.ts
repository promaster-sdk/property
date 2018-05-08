import * as PropertyValueSet from "../property-value-set";

export type CompiledFilterFunction = (
  properties: PropertyValueSet.PropertyValueSet
) => boolean;

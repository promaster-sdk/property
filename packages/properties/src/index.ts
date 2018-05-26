/**
 * Functions related to the "Properties" module in Promaster
 */

import { Amount, Units } from "@promaster/uom";
import {
  PropertyValueSet,
  PropertyValue,
  PropertyFilter
} from "@promaster/property";
import * as Api from "@promaster/promaster-api";

export function getDefaultValues(
  productProperties: ReadonlyArray<Api.ProductProperty>
): PropertyValueSet.PropertyValueSet {
  let defaultValues: PropertyValueSet.PropertyValueSet = PropertyValueSet.Empty;
  for (const p of productProperties) {
    let defValue: PropertyValue.PropertyValue | undefined = undefined;
    for (const def of p.def_value) {
      if (PropertyFilter.isValid(defaultValues, def.property_filter)) {
        defValue = def.value;
      }
    }
    const value = getValueOrFallback(p, defValue);
    if (value) {
      defaultValues = PropertyValueSet.set(p.name, value, defaultValues);
    }
  }
  return defaultValues;

  function getValueOrFallback(
    p: Api.ProductProperty,
    defValue: PropertyValue.PropertyValue | undefined
  ): PropertyValue.PropertyValue | undefined {
    switch (p.quantity) {
      case "Discrete":
        if (p.value === undefined || p.value.length === 0) {
          return undefined;
        } // Don't include PropertyValueSets with no valid property values
        return defValue && defValue.type === "integer"
          ? defValue
          : p.value[0].value;
      case "Text":
        return defValue && defValue.type === "text"
          ? defValue
          : PropertyValue.fromText("");
      default:
        const unit = Units.getUnitsForQuantity(p.quantity)[0];
        return defValue && defValue.type === "amount"
          ? defValue
          : PropertyValue.fromAmount(Amount.create(0, unit || Units.One, 2));
    }
  }
}

/**
 * Functions related to the "Ordering Code" module in Promaster
 */

import * as R from "ramda";
import {
  PropertyValueSet,
  PropertyValue,
  Amount,
  PropertyFilter,
  Units
} from "@promaster/promaster-primitives";
import * as Api from "@promaster/promaster-api";

export interface BuiltOrderingCode {
  readonly type: string;
  readonly code: string;
}

const amountRegex = new RegExp("{([a-z0-9_]+):([A-Za-z]+):([0-9]+)}", "g"); //tslint:disable-line

export function buildOrderingCodes(
  codeRows: ReadonlyArray<Api.ProductCode>,
  propertyValueSet: PropertyValueSet.PropertyValueSet
): ReadonlyArray<BuiltOrderingCode> {
  const matchingCodeParts = codeRows.filter(c =>
    PropertyFilter.isValid(propertyValueSet, c.property_filter)
  );
  const codes = R.groupBy(c => c.type, matchingCodeParts);
  const finalCodes = R.keys(codes).map(t => {
    const finalCode: string = PropertyValueSet.getPropertyNames(
      propertyValueSet
    ).reduce((c, p) => {
      const value:
        | PropertyValue.PropertyValue
        | undefined = PropertyValueSet.get(p, propertyValueSet);
      if (value === undefined) {
        return c;
      }
      switch (value.type) {
        case "integer":
          return c.replace(new RegExp(`\{${p}\}`, "g"), value.value.toString()); //tslint:disable-line
        case "text":
          return c.replace(new RegExp(`\{${p}\}`, "g"), value.value); //tslint:disable-line
        case "amount":
          return c.replace(
            amountRegex,
            (match: string, p1: string, p2: string, p3: string): string => {
              const amount = PropertyValue.getAmount(value);
              const property = p1;
              const unit = Units.getUnitFromString(p2);
              const decimals = parseInt(p3, 10);
              if (
                amount &&
                property === p &&
                unit &&
                !isNaN(decimals) &&
                unit.quantity === amount.unit.quantity
              ) {
                return Amount.valueAs(unit, amount).toFixed(decimals);
              } else {
                return match;
              }
            }
          );
        default:
          return c;
      }
    }, codes[t].map(code => code.code).join(""));

    return {
      type: t,
      code: finalCode
    };
  });
  return finalCodes;
}

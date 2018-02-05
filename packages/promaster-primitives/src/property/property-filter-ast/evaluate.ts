import * as Ast from "./types";
import * as PropertyValue from "../property-value";
import * as PropertyValueSet from "../property-value-set";
import { exhaustiveCheck } from "../../utils/exhaustive-check";

export function evaluate(
  e: Ast.BooleanExpr,
  properties: PropertyValueSet.PropertyValueSet,
  matchMissingIdentifiers: boolean
): boolean {
  switch (e.type) {
    case "AndExpr": {
      for (const child of e.children) {
        if (!evaluate(child, properties, matchMissingIdentifiers)) {
          return false;
        }
      }
      return true;
    }
    case "OrExpr": {
      for (const child of e.children) {
        if (evaluate(child, properties, matchMissingIdentifiers)) {
          return true;
        }
      }
      return false;
    }
    case "EqualsExpr": {
      // Handle match missing identifier
      if (matchMissingIdentifiers) {
        if (
          _isMissingIdent(e.leftValue, properties) ||
          e.rightValueRanges.filter(
            (vr: Ast.ValueRangeExpr) =>
              _isMissingIdent(vr.min, properties) ||
              _isMissingIdent(vr.max, properties)
          ).length > 0
        ) {
          return true;
        }
      }

      const left = evaluatePropertyValueExpr(e.leftValue, properties);

      for (const range of e.rightValueRanges) {
        const min = evaluatePropertyValueExpr(range.min, properties);
        const max = evaluatePropertyValueExpr(range.max, properties);

        // Match on NULL or inclusive in range
        if (
          ((max === null || min === null) && left === null) ||
          (left !== null &&
            min !== null &&
            max !== null &&
            (PropertyValue.greaterOrEqualTo(left, min) &&
              PropertyValue.lessOrEqualTo(left, max)))
        ) {
          return e.operationType === "equals";
        }
      }

      return e.operationType === "notEquals";
    }
    case "ComparisonExpr": {
      // Handle match missing identifier
      if (
        matchMissingIdentifiers &&
        (_isMissingIdent(e.leftValue, properties) ||
          _isMissingIdent(e.rightValue, properties))
      ) {
        return true;
      }

      const left = evaluatePropertyValueExpr(e.leftValue, properties);
      if (left === null) {
        return false;
      }

      const right = evaluatePropertyValueExpr(e.rightValue, properties);
      if (right === null) {
        return false;
      }

      switch (e.operationType) {
        case "less":
          return PropertyValue.lessThan(left, right);
        case "greater":
          return PropertyValue.greaterThan(left, right);
        case "lessOrEqual":
          return PropertyValue.lessOrEqualTo(left, right);
        case "greaterOrEqual":
          return PropertyValue.greaterOrEqualTo(left, right);
        default:
          throw new Error(`Unknown comparisontype`);
      }
    }
    case "EmptyExpr": {
      return true;
    }
    default: {
      return exhaustiveCheck(e, true);
    }
  }
}

function evaluatePropertyValueExpr(
  e: Ast.PropertyValueExpr,
  properties: PropertyValueSet.PropertyValueSet
): PropertyValue.PropertyValue | null {
  switch (e.type) {
    case "IdentifierExpr": {
      const pv = PropertyValueSet.get(e.name, properties);
      return pv || null;
    }
    case "ValueExpr": {
      return e.parsed;
    }
    case "NullExpr": {
      return null;
    }
    default: {
      return exhaustiveCheck(e, true);
    }
  }
}

function _isMissingIdent(
  e: Ast.PropertyValueExpr,
  properties: PropertyValueSet.PropertyValueSet
): boolean {
  // If expression is an missing identifier it should match anything
  if (e.type === "IdentifierExpr") {
    if (!PropertyValueSet.hasProperty(e.name, properties)) {
      return true;
    }
  }
  return false;
}

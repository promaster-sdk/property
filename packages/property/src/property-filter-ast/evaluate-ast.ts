import * as Ast from "./types";
import * as PropertyValue from "../property-value";
import * as PropertyValueSet from "../property-value-set";
import { exhaustiveCheck } from "../utils/exhaustive-check";
import { Amount } from "uom";

export function evaluateAst(
  e: Ast.BooleanExpr,
  properties: PropertyValueSet.PropertyValueSet,
  matchMissingIdentifiers: boolean,
  comparer: PropertyValue.Comparer
): boolean {
  switch (e.type) {
    case "AndExpr": {
      for (const child of e.children) {
        if (
          !evaluateAst(child, properties, matchMissingIdentifiers, comparer)
        ) {
          return false;
        }
      }
      return true;
    }
    case "OrExpr": {
      for (const child of e.children) {
        if (evaluateAst(child, properties, matchMissingIdentifiers, comparer)) {
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
            (PropertyValue.greaterOrEqualTo(left, min, comparer) &&
              PropertyValue.lessOrEqualTo(left, max, comparer)))
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
          return PropertyValue.lessThan(left, right, comparer);
        case "greater":
          return PropertyValue.greaterThan(left, right, comparer);
        case "lessOrEqual":
          return PropertyValue.lessOrEqualTo(left, right, comparer);
        case "greaterOrEqual":
          return PropertyValue.greaterOrEqualTo(left, right, comparer);
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
    case "AddExpr": {
      const left = evaluatePropertyValueExpr(e.left, properties);
      const right = evaluatePropertyValueExpr(e.right, properties);
      if (!left) {
        return right;
      }
      if (!right) {
        return left;
      }
      if (left.type === "integer" && right.type === "integer") {
        if (e.operationType === "add") {
          return PropertyValue.fromInteger(left.value + right.value);
        } else {
          return PropertyValue.fromInteger(left.value - right.value);
        }
      } else if (left.type === "text" && right.type === "text") {
        if (e.operationType === "add") {
          return PropertyValue.fromText(left.value + right.value);
        } else {
          return null;
        }
      } else if (left.type === "amount" && right.type === "amount") {
        if (e.operationType === "add") {
          return PropertyValue.fromAmount(Amount.plus(left.value, right.value));
        } else {
          return PropertyValue.fromAmount(
            Amount.minus(left.value, right.value)
          );
        }
      }
      return null;
    }
    case "MulExpr": {
      const left = evaluatePropertyValueExpr(e.left, properties);
      const right = evaluatePropertyValueExpr(e.right, properties);
      if (!left || !right) {
        return null;
      }
      if (left.type === "integer" && right.type === "integer") {
        if (e.operationType === "multiply") {
          return PropertyValue.fromInteger(left.value * right.value);
        } else {
          return PropertyValue.fromInteger(left.value / right.value);
        }
      } else if (left.type === "amount" && right.type === "integer") {
        if (e.operationType === "multiply") {
          return PropertyValue.fromAmount(
            Amount.times(left.value, right.value)
          );
        } else {
          return PropertyValue.fromAmount(
            Amount.divide(left.value, right.value)
          );
        }
      } else if (left.type === "integer" && right.type === "amount") {
        if (e.operationType === "multiply") {
          return PropertyValue.fromAmount(
            Amount.times(right.value, left.value)
          );
        }
      }
      return null;
    }
    case "UnaryExpr": {
      const value = evaluatePropertyValueExpr(e.value, properties);
      if (!value || value.type === "text") {
        return null;
      }
      if (value.type === "integer") {
        return PropertyValue.fromInteger(-value.value);
      } else {
        return PropertyValue.fromAmount(Amount.neg(value.value));
      }
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

import * as Ast from "./types";
import * as PropertyValue from "../property-value";
import * as PropertyValueSet from "../property-value-set";
import { exhaustiveCheck } from "../utils/exhaustive-check";
import { CompiledFilterFunction } from "./compiled-filter";

export function compileToLambdas(e: Ast.BooleanExpr): CompiledFilterFunction {
  switch (e.type) {
    case "AndExpr": {
      const childrenLamdas = e.children.map(compileToLambdas);
      return (
        properties: PropertyValueSet.PropertyValueSet,
        comparer: PropertyValue.Comparer
      ) => childrenLamdas.every(child => child(properties, comparer));
    }
    case "OrExpr": {
      const childrenLamdas = e.children.map(compileToLambdas);
      return (
        properties: PropertyValueSet.PropertyValueSet,
        comparer: PropertyValue.Comparer
      ) => !!childrenLamdas.find(child => child(properties, comparer));
    }
    case "EqualsExpr": {
      const leftLamda = makeEvalLambdaForPropertyValueExpr(e.leftValue);
      const rightLamdas = e.rightValueRanges.map(range => [
        makeEvalLambdaForPropertyValueExpr(range.min),
        makeEvalLambdaForPropertyValueExpr(range.max)
      ]);

      return (
        pvs: PropertyValueSet.PropertyValueSet,
        comparer: PropertyValue.Comparer
      ) => {
        const left = leftLamda(pvs);
        for (const range of rightLamdas) {
          const min = range[0](pvs);
          const max = range[1](pvs);
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
      };
    }

    case "ComparisonExpr": {
      //   // Handle match missing identifier
      //   if (
      //     matchMissingIdentifiers &&
      //     (_isMissingIdent(e.leftValue, properties) ||
      //       _isMissingIdent(e.rightValue, properties))
      //   ) {
      //     return true;
      //   }

      //   const left = evaluatePropertyValueExpr(e.leftValue, properties);
      //   if (left === null) {
      //     return false;
      //   }

      //   const right = evaluatePropertyValueExpr(e.rightValue, properties);
      //   if (right === null) {
      //     return false;
      //   }

      //   switch (e.operationType) {
      //     case "less":
      //       return PropertyValue.lessThan(left, right);
      //     case "greater":
      //       return PropertyValue.greaterThan(left, right);
      //     case "lessOrEqual":
      //       return PropertyValue.lessOrEqualTo(left, right);
      //     case "greaterOrEqual":
      //       return PropertyValue.greaterOrEqualTo(left, right);
      //     default:
      //       throw new Error(`Unknown comparisontype`);
      //   }
      return () => true;
    }
    case "EmptyExpr": {
      return () => true;
    }
    default: {
      // return () => true;
      return exhaustiveCheck(e, true);
    }
  }
}

export type EvaluatePropertyValueExprFunc = (
  properties: PropertyValueSet.PropertyValueSet
) => PropertyValue.PropertyValue | null;

export function makeEvalLambdaForPropertyValueExpr(
  e: Ast.PropertyValueExpr
): EvaluatePropertyValueExprFunc {
  switch (e.type) {
    case "IdentifierExpr": {
      return (pvs: PropertyValueSet.PropertyValueSet) => {
        const pv = PropertyValueSet.get(e.name, pvs);
        return pv || null;
      };
    }
    case "ValueExpr": {
      return () => e.parsed;
    }
    case "NullExpr": {
      return () => null;
    }
    case "AddExpr": {
      return () => null;
    }
    case "MulExpr": {
      return () => null;
    }
    case "UnaryExpr": {
      return () => null;
    }
    default: {
      return exhaustiveCheck(e, true);
    }
  }
}

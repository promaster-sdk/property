import * as Ast from "./types";
import { exhaustiveCheck } from "../utils/exhaustive-check";
import { CompiledFilterFunction } from "./compiled-filter";

export function compileToString(e: Ast.BooleanExpr): CompiledFilterFunction {
  const funcstr = makeJSExprForBooleanExpr(e);
  // console.log("funcstr", funcstr);
  const func = new Function("p", "return " + funcstr) as CompiledFilterFunction;
  return func;
}

function makeJSExprForBooleanExpr(e: Ast.BooleanExpr): string {
  const jsExpression = (() => {
    switch (e.type) {
      case "AndExpr": {
        let mystr = "";
        for (const child of e.children) {
          mystr += " && " + makeJSExprForBooleanExpr(child);
        }
        return mystr.length ? mystr.substr(4) : mystr;
      }
      case "OrExpr": {
        let mystr = "";
        for (const child of e.children) {
          mystr += " || " + makeJSExprForBooleanExpr(child);
        }
        return mystr.length ? mystr.substr(4) : mystr;
      }
      case "EqualsExpr": {
        let mystr = "";
        let singleOrCount = 0;
        const left = makeJsExprForPropertyValueExpr(e.leftValue);
        for (const range of e.rightValueRanges) {
          const min = makeJsExprForPropertyValueExpr(range.min);
          const max = makeJsExprForPropertyValueExpr(range.max);
          if (min === max) {
            singleOrCount++;
            if (e.operationType === "equals") {
              mystr += ` || ${left} === ${max}`;
            } else {
              mystr += ` && ${left} !== ${max}`;
            }
          } else {
            if (e.operationType === "equals") {
              mystr += ` || (${left} >= ${min} && ${left} <= ${max})`;
            } else {
              mystr += ` && (${left} < ${min} || ${left} > ${max})`;
            }
          }
        }
        return mystr.length
          ? singleOrCount > 1 ? "(" + mystr.substr(4) + ")" : mystr.substr(4)
          : mystr;
      }
      case "ComparisonExpr": {
        const left = makeJsExprForPropertyValueExpr(e.leftValue);
        if (left === "null") {
          return " false ";
        }
        const right = makeJsExprForPropertyValueExpr(e.rightValue);
        if (right === "null") {
          return " false ";
        }
        switch (e.operationType) {
          case "less":
            return left + " < " + right;
          case "greater":
            return left + " > " + right;
          case "lessOrEqual":
            return left + " <= " + right;
          case "greaterOrEqual":
            return left + " >= " + right;
          default:
            return exhaustiveCheck(e.operationType, true);
        }
      }
      case "EmptyExpr": {
        return " true ";
      }
      default: {
        // tslint:disable-next-line:no-any
        return exhaustiveCheck(e, true, (e as any).type);
      }
    }
  })();

  return jsExpression === "" ? jsExpression : "(" + jsExpression + ")";
}

// Returns something that evaluates to a PropertyValue or null
function makeJsExprForPropertyValueExpr(e: Ast.PropertyValueExpr): string {
  switch (e.type) {
    case "IdentifierExpr": {
      return "(p['" + e.name + "'] && p['" + e.name + "'].value)";
    }
    case "ValueExpr": {
      if (e.parsed.type !== "integer") {
        throw new Error(
          "PropertyFilter with non integer value cannot be compiled."
        );
      }
      return e.parsed.value.toString();
    }
    case "NullExpr": {
      return "undefined";
    }
    case "AddExpr": {
      const left = makeJsExprForPropertyValueExpr(e.left);
      const right = makeJsExprForPropertyValueExpr(e.right);
      switch (e.operationType) {
        case "add":
          return left + " + " + right;
        case "subtract":
          return left + " - " + right;
        default:
          return exhaustiveCheck(e.operationType, true);
      }
    }
    case "MulExpr": {
      const left = makeJsExprForPropertyValueExpr(e.left);
      const right = makeJsExprForPropertyValueExpr(e.right);
      switch (e.operationType) {
        case "multiply":
          return left + " * " + right;
        case "divide":
          return left + " / " + right;
        default:
          return exhaustiveCheck(e.operationType, true);
      }
    }
    case "UnaryExpr": {
      const value = makeJsExprForPropertyValueExpr(e.value);
      return "-" + value;
    }

    default: {
      return exhaustiveCheck(e, true);
    }
  }
}

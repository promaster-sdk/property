import * as Ast from "./types";
import { exhaustiveCheck } from "../../utils/exhaustive-check";
import { CompiledFilterFunction } from "./compiled-filter";

export function compileToString(e: Ast.BooleanExpr): CompiledFilterFunction {
  const props: Set<string> = new Set();
  const funcstr = makeJSExprForBooleanExpr(e, props);
  // console.log("funcstr", funcstr, props);
  const func = new Function("p", "return " + funcstr) as CompiledFilterFunction;
  return func;
}

function makeJSExprForBooleanExpr(e: Ast.BooleanExpr, p: Set<string>): string {
  switch (e.type) {
    case "AndExpr": {
      let mystr = "";
      for (const child of e.children) {
        mystr += " && " + makeJSExprForBooleanExpr(child, p);
      }
      return mystr.length ? mystr.substr(4) : mystr;
    }
    case "OrExpr": {
      let mystr = "";
      for (const child of e.children) {
        mystr += " || " + makeJSExprForBooleanExpr(child, p);
      }
      return mystr.length ? mystr.substr(4) : mystr;
    }
    case "EqualsExpr": {
      let mystr = "";
      const left = makeJsExprForPropertyValueExpr(e.leftValue, p);
      for (const range of e.rightValueRanges) {
        const min = makeJsExprForPropertyValueExpr(range.min, p);
        const max = makeJsExprForPropertyValueExpr(range.max, p);
        if (min === max) {
          mystr +=
            e.operationType === "equals"
              ? " || " + left + " === " + max
              : " || " + left + " !== " + max;
        } else {
          mystr +=
            " || (" + left + " >= " + min + " && " + left + " <= " + max + ")";
        }
      }
      return mystr.length ? mystr.substr(4) : mystr;
    }
    case "ComparisonExpr": {
      const left = makeJsExprForPropertyValueExpr(e.leftValue, p);
      if (left === "null") {
        return " false ";
      }
      const right = makeJsExprForPropertyValueExpr(e.rightValue, p);
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
}

// Returns something that evaluates to a PropertyValue or null
function makeJsExprForPropertyValueExpr(
  e: Ast.PropertyValueExpr,
  p: Set<string>
): string {
  switch (e.type) {
    case "IdentifierExpr": {
      p.add(e.name);
      // return "p." + e.name + ".value";
      return "(p." + e.name + " && p." + e.name + ".value)";
    }
    case "ValueExpr": {
      if (e.parsed.type !== "integer") {
        throw new Error("Non integer value.");
      }
      return e.parsed.value.toString();
    }
    case "NullExpr": {
      return "undefined";
    }
    default: {
      return exhaustiveCheck(e, true);
    }
  }
}

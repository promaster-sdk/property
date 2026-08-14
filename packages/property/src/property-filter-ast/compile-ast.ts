import * as Ast from "./types";
import * as PropertyValueSet from "../property-value-set";
import * as PropertyValue from "../property-value";
import * as CompileToString from "./compile-to-string";
import { CompiledFilterFunction } from "./compiled-filter";
import { exhaustiveCheck } from "../utils/exhaustive-check";
import { evaluateAst } from "./evaluate-ast";

/**
 * Compiles the AST into a callable javascript function
 * The compiled function does is an optimized version and
 * it does not support matching missing identifiers
 */
export function compileAst(ast: Ast.BooleanExpr): CompiledFilterFunction {
  // Depending on what the property filter contains we can use different
  // compilers.
  // The fastest is to compile to a JS expression string
  // and make a function from that but it does not support:
  // * Amount values (103:Meter)
  // * Comparing name to name (a<b) (because then we don't know if they are Amount)
  // * Text values (because they require case-insensitive comparision)
  if (isNotCompilable(ast)) {
    return (properties: PropertyValueSet.PropertyValueSet, comparer: PropertyValue.Comparer) =>
      evaluateAst(ast, properties, false, comparer);
  }

  return CompileToString.compileToString(ast);
}

function isNotCompilable(ast: Ast.BooleanExpr): boolean {
  let hasAddOrMul = false;
  let hasAmountOrText = false;
  let hasNameToNameComparision = false;
  walkExpr(ast, (e) => {
    if (e.type === "ValueExpr" && e.parsed.type !== "integer") {
      hasAmountOrText = true;
    }
    if (e.type === "AddExpr" || e.type === "MulExpr") {
      hasAddOrMul = true;
    }
    if (
      e.type === "ComparisonExpr" &&
      e.leftValue.type === "IdentifierExpr" &&
      e.rightValue.type === "IdentifierExpr"
    ) {
      hasNameToNameComparision = true;
    }
    if (
      e.type === "EqualsExpr" &&
      e.leftValue.type === "IdentifierExpr" &&
      e.rightValueRanges.find((item) => item.min.type === "IdentifierExpr" || item.max.type === "IdentifierExpr")
    ) {
      hasNameToNameComparision = true;
    }
  });

  return hasAddOrMul || hasAmountOrText || hasNameToNameComparision;
}

export function walkExpr(e: Ast.Expr, walk: (e: Ast.Expr) => void): void {
  switch (e.type) {
    case "AndExpr": {
      walk(e);
      for (const child of e.children) {
        walkExpr(child, walk);
      }
      return;
    }
    case "OrExpr": {
      walk(e);
      for (const child of e.children) {
        walkExpr(child, walk);
      }
      return;
    }
    case "EqualsExpr": {
      walk(e);
      walkExpr(e.leftValue, walk);
      for (const range of e.rightValueRanges) {
        walkExpr(range, walk);
      }
      return;
    }
    case "ValueRangeExpr": {
      walkExpr(e.min, walk);
      walkExpr(e.max, walk);
      return;
    }
    case "ComparisonExpr": {
      walk(e);
      walkExpr(e.leftValue, walk);
      walkExpr(e.rightValue, walk);
      return;
    }
    case "AddExpr": {
      walk(e);
      walkExpr(e.left, walk);
      walkExpr(e.right, walk);
      return;
    }
    case "MulExpr": {
      walk(e);
      walkExpr(e.left, walk);
      walkExpr(e.right, walk);
      return;
    }
    case "UnaryExpr": {
      walk(e);
      walkExpr(e.value, walk);
      return;
    }
    case "EmptyExpr":
    case "IdentifierExpr":
    case "ValueExpr":
    case "NullExpr": {
      walk(e);
      return;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
      return exhaustiveCheck(e, true, (e as any).type);
    }
  }
}

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
    return (
      properties: PropertyValueSet.PropertyValueSet,
      comparer: PropertyValue.Comparer
    ) => evaluateAst(ast, properties, false, comparer);
  }

  return CompileToString.compileToString(ast);
}

function isNotCompilable(ast: Ast.BooleanExpr): boolean {
  let hasAddOrMul = false;
  let hasAmountOrText = false;
  let hasNameToNameComparision = false;
  visitAllExpr(ast, e => {
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
      e.rightValueRanges.find(
        item =>
          item.min.type === "IdentifierExpr" ||
          item.max.type === "IdentifierExpr"
      )
    ) {
      hasNameToNameComparision = true;
    }
  });

  return hasAddOrMul || hasAmountOrText || hasNameToNameComparision;
}

function visitAllExpr(e: Ast.Expr, visit: (e: Ast.Expr) => void): void {
  switch (e.type) {
    case "AndExpr": {
      visit(e);
      for (const child of e.children) {
        visitAllExpr(child, visit);
      }
      return;
    }
    case "OrExpr": {
      visit(e);
      for (const child of e.children) {
        visitAllExpr(child, visit);
      }
      return;
    }
    case "EqualsExpr": {
      visit(e);
      visitAllExpr(e.leftValue, visit);
      for (const range of e.rightValueRanges) {
        visitAllExpr(range, visit);
      }
      return;
    }
    case "ValueRangeExpr": {
      visitAllExpr(e.min, visit);
      visitAllExpr(e.max, visit);
      return;
    }
    case "ComparisonExpr": {
      visit(e);
      visitAllExpr(e.leftValue, visit);
      visitAllExpr(e.rightValue, visit);
      return;
    }
    case "AddExpr": {
      visit(e);
      visitAllExpr(e.left, visit);
      visitAllExpr(e.right, visit);
      return;
    }
    case "MulExpr": {
      visit(e);
      visitAllExpr(e.left, visit);
      visitAllExpr(e.right, visit);
      return;
    }
    case "UnaryExpr": {
      visit(e);
      visitAllExpr(e.value, visit);
      return;
    }
    case "EmptyExpr":
    case "IdentifierExpr":
    case "ValueExpr":
    case "NullExpr": {
      visit(e);
      return;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
      return exhaustiveCheck(e, true, (e as any).type);
    }
  }
}

import {
  PropertyValue,
  PropertyFilter,
  PropertyFilterAst as Ast
} from "@promaster/promaster-primitives";

export function filterPrettyPrintSimple(
  f: PropertyFilter.PropertyFilter
): string {
  if (f.ast === null) {
    return "";
  }
  let result = "";
  result = _print(f.ast, result);
  return result;
}

function _print(e: Ast.Expr, s: string): string {
  if (e.type === "AndExpr") {
    for (let child of e.children) {
      s = _print(child, s);
      if (child !== e.children[e.children.length - 1]) {
        s += " and ";
      }
    }
  } else if (e.type === "ComparisonExpr") {
    s = _print(e.leftValue, s);
    s += _comparisonOperationTypeToString(e.operationType);
    s = _print(e.rightValue, s);
  } else if (e.type === "EmptyExpr") {
    // Nothing
  } else if (e.type === "EqualsExpr") {
    s = _print(e.leftValue, s);
    s += _equalsOperationTypeToString(e.operationType);
    for (let range of e.rightValueRanges) {
      s = _print(range, s);
      if (range !== e.rightValueRanges[e.rightValueRanges.length - 1]) {
        s += ",";
      }
    }
  } else if (e.type === "IdentifierExpr") {
    s += e.name;
  } else if (e.type === "OrExpr") {
    for (let child of e.children) {
      s = _print(child, s);
      if (child !== e.children[e.children.length - 1]) {
        s += " or ";
      }
    }
  } else if (e.type === "ValueExpr") {
    s += PropertyValue.toString(e.parsed);
  } else if (e.type === "ValueRangeExpr") {
    s = _print(e.min, s);
    if (e.min !== e.max) {
      s += "-";
      s = _print(e.max, s);
    }
  } else if (e.type === "NullExpr") {
    s += "null";
  }

  return s;
}

function _comparisonOperationTypeToString(
  type: Ast.ComparisonOperationType
): string {
  switch (type) {
    case "lessOrEqual":
      return " must be less than or equal to ";
    case "greaterOrEqual":
      return " must be greater than or equal to ";
    case "less":
      return " must be less than ";
    case "greater":
      return " must be greater than ";
    default:
      throw "Unknown ComparisonOperationType ";
  }
}

function _equalsOperationTypeToString(type: Ast.EqualsOperationType): string {
  switch (type) {
    case "equals":
      return " must be ";
    case "notEquals":
      return " must not be ";
    default:
      throw "Unknown EqualsOperationType ";
  }
}

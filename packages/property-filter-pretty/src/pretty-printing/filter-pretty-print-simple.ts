import {
  PropertyValue,
  PropertyFilter,
  PropertyFilterAst as Ast
} from "@promaster-sdk/property";
import { exhaustiveCheck } from "ts-exhaustive-check/lib-cjs";

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
  switch (e.type) {
    case "AndExpr": {
      for (let child of e.children) {
        s = _print(child, s);
        if (child !== e.children[e.children.length - 1]) {
          s += " and ";
        }
      }
      break;
    }
    case "ComparisonExpr": {
      s = _print(e.leftValue, s);
      s += _comparisonOperationTypeToString(e.operationType);
      s = _print(e.rightValue, s);
      break;
    }
    case "EqualsExpr": {
      s = _print(e.leftValue, s);
      s += _equalsOperationTypeToString(e.operationType);
      for (let range of e.rightValueRanges) {
        s = _print(range, s);
        if (range !== e.rightValueRanges[e.rightValueRanges.length - 1]) {
          s += ",";
        }
      }
      break;
    }

    case "IdentifierExpr": {
      s += e.name;
      break;
    }
    case "OrExpr": {
      for (let child of e.children) {
        s = _print(child, s);
        if (child !== e.children[e.children.length - 1]) {
          s += " or ";
        }
      }
      break;
    }

    case "ValueRangeExpr": {
      s = _print(e.min, s);
      if (e.min !== e.max) {
        s += "-";
        s = _print(e.max, s);
      }
      break;
    }

    case "ValueExpr": {
      s += PropertyValue.toString(e.parsed);
      break;
    }

    case "NullExpr": {
      s += "null";
      break;
    }
    case "AddExpr": {
      s += `${_print(e.left, s)} ${
        e.operationType === "add" ? "+" : "-"
      } ${_print(e.right, s)}`;
      break;
    }
    case "MulExpr": {
      s += `${_print(e.left, s)} ${
        e.operationType === "multiply" ? "*" : "/"
      } ${_print(e.right, s)}`;
      break;
    }
    case "UnaryExpr": {
      s += `-${_print(e.value, "")}`;
      break;
    }
    case "EmptyExpr": {
      break;
    }

    default: {
      exhaustiveCheck(e, true);
    }
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

import * as Ast from "./types";
import { exhaustiveCheck } from "../../utils/exhaustive-check";

export function findProperties(
  e: Ast.BooleanExpr,
  properties: Array<string>
): void {
  switch (e.type) {
    case "AndExpr":
      for (const child of e.children) {
        findProperties(child, properties);
      }
      break;
    case "ComparisonExpr":
      _findPropertiesInPropertyValueExpr(e.leftValue, properties);
      _findPropertiesInPropertyValueExpr(e.rightValue, properties);
      break;
    case "EmptyExpr":
      // Do nothing
      break;
    case "EqualsExpr":
      _findPropertiesInPropertyValueExpr(e.leftValue, properties);
      for (const range of e.rightValueRanges) {
        _findPropertiesInValueRangeExpr(range, properties);
      }
      break;
    case "OrExpr":
      for (const child of e.children) {
        findProperties(child, properties);
      }
      break;
    default:
      exhaustiveCheck(e, true);
  }
}

function _findPropertiesInPropertyValueExpr(
  e: Ast.PropertyValueExpr,
  properties: Array<string>
): void {
  switch (e.type) {
    case "IdentifierExpr": {
      properties.push(e.name);
      break;
    }
    case "ValueExpr":
      // Do nothing
      break;
    case "NullExpr":
      // Do nothing
      break;
    default:
      exhaustiveCheck(e, true);
  }
}

function _findPropertiesInValueRangeExpr(
  e: Ast.ValueRangeExpr,
  properties: Array<string>
): void {
  _findPropertiesInPropertyValueExpr(e.min, properties);
  _findPropertiesInPropertyValueExpr(e.max, properties);
}

import * as Ast from "./types";
import { exhaustiveCheck } from "../utils/exhaustive-check";

// eslint-disable-next-line functional/prefer-readonly-type
export function findProperties(e: Ast.BooleanExpr, properties: Array<string>): void {
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
        _findPropertiesInPropertyValueExpr(range.min, properties);
        _findPropertiesInPropertyValueExpr(range.max, properties);
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

// eslint-disable-next-line functional/prefer-readonly-type
function _findPropertiesInPropertyValueExpr(e: Ast.PropertyValueExpr, properties: Array<string>): void {
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
    case "AddExpr":
      _findPropertiesInPropertyValueExpr(e.left, properties);
      _findPropertiesInPropertyValueExpr(e.right, properties);
      break;
    case "MulExpr":
      _findPropertiesInPropertyValueExpr(e.left, properties);
      _findPropertiesInPropertyValueExpr(e.right, properties);
      break;
    case "UnaryExpr":
      _findPropertiesInPropertyValueExpr(e.value, properties);
      break;

    default:
      exhaustiveCheck(e, true);
  }
}

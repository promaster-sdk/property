import {
  PropertyFilterAst as Ast,
  PropertyValue,
  UnitName
} from "@promaster/promaster-primitives";
import { exhaustiveCheck } from "../../exhaustive-check/index";

export function comparisionOperationMessage(
  op: Ast.ComparisonOperationType,
  left: string,
  right: string
): string {
  return `${left} ${_comparisonOperationTypeToString(op)} ${right}`;
}

export function equalsOperationMessage(
  op: Ast.EqualsOperationType,
  left: string,
  right: string
): string {
  return `${left} ${_equalsOperationTypeToString(op)} ${right}`;
}

export function rangeMessage(min: string, max: string): string {
  return `between ${min} and ${max}`;
}

export function andMessage(): string {
  return "and";
}

export function orMessage(): string {
  return "or";
}

export function propertyNameMessage(propertyName: string): string {
  return propertyName;
}

export function propertyValueMessage(
  propertyName: string,
  propertyValue: PropertyValue.PropertyValue
): string {
  switch (propertyValue.type) {
    case "amount":
      return (
        propertyValue.value.value +
        " " +
        UnitName.getName(propertyValue.value.unit)
      );
    case "integer":
      const pvString = PropertyValue.toString(propertyValue);
      return `${propertyName}_${pvString}`;
    case "text":
      return propertyValue.value;
    default:
      return exhaustiveCheck(propertyValue);
  }
  // return "MESSAGE NOT AVAILABLE";
}

export function nullMessage(): string {
  return "null";
}

function _comparisonOperationTypeToString(
  type: Ast.ComparisonOperationType
): string {
  switch (type) {
    case "lessOrEqual":
      return "must be less than or equal to";
    case "greaterOrEqual":
      return "must be greater than or equal to";
    case "less":
      return "must be less than";
    case "greater":
      return "must be greater than";
    default:
      throw "Unknown ComparisonOperationType ";
  }
}

function _equalsOperationTypeToString(type: Ast.EqualsOperationType): string {
  switch (type) {
    case "equals":
      return "must be";
    case "notEquals":
      return "must not be";
    default:
      throw new Error(`Unknown EqualsOperationType ${type}.`);
  }
}

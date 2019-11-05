import {
  PropertyFilterAst as Ast,
  PropertyValue
} from "@promaster-sdk/property";
import { Format, UnitFormat } from "uom";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { FilterPrettyPrintMessages } from "./filter-pretty-print-messages";

export function buildEnglishMessages(
  unitsFormat: UnitFormat.UnitFormatMap
): FilterPrettyPrintMessages {
  return {
    comparisionOperationMessage(
      op: Ast.ComparisonOperationType,
      left: string,
      right: string
    ): string {
      return `${left} ${_comparisonOperationTypeToString(op)} ${right}`;
    },

    equalsOperationMessage(
      op: Ast.EqualsOperationType,
      left: string,
      right: string
    ): string {
      return `${left} ${_equalsOperationTypeToString(op)} ${right}`;
    },

    rangeMessage(min: string, max: string): string {
      return `between ${min} and ${max}`;
    },

    andMessage(): string {
      return "and";
    },

    orMessage(): string {
      return "or";
    },

    propertyNameMessage(propertyName: string): string {
      return propertyName;
    },

    propertyValueMessage(
      propertyName: string,
      propertyValue: PropertyValue.PropertyValue
      // unitsFormat: {
      //   readonly [key: string]: UnitFormat.UnitFormat;
      // } = UnitsFormat
      // unitsFormat: UnitFormat.UnitFormatMap
    ): string {
      switch (propertyValue.type) {
        case "amount": {
          const unitFormat = Format.getUnitFormat(
            propertyValue.value.unit,
            unitsFormat
          );
          if (unitFormat) {
            return propertyValue.value.value + " " + unitFormat.label;
          } else {
            return propertyValue.value.value.toString();
          }
        }
        case "integer":
          // eslint-disable-next-line no-case-declarations
          const pvString = PropertyValue.toString(propertyValue);
          return `${propertyName}_${pvString}`;
        case "text":
          return propertyValue.value;
        default:
          return exhaustiveCheck(propertyValue);
      }
      // return "MESSAGE NOT AVAILABLE";
    },

    nullMessage(): string {
      return "null";
    }
  };
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
      throw new Error("Unknown ComparisonOperationType ");
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

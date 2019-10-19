/* eslint-disable functional/no-method-signature */
import {
  PropertyFilterAst as Ast,
  PropertyValue
} from "@promaster-sdk/property";

export interface FilterPrettyPrintMessages {
  comparisionOperationMessage(
    op: Ast.ComparisonOperationType,
    left: string,
    right: string
  ): string;

  equalsOperationMessage(
    op: Ast.EqualsOperationType,
    left: string,
    right: string
  ): string;

  rangeMessage(min: string, max: string): string;

  andMessage(): string;

  orMessage(): string;

  propertyNameMessage(propertyName: string): string;

  propertyValueMessage(
    propertyName: string,
    pv: PropertyValue.PropertyValue
  ): string;

  nullMessage(): string;
}

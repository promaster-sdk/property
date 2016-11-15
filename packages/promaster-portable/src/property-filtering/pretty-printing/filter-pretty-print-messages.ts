import {PropertyFilterAst as Ast, PropertyValue} from "promaster-primitives";

export interface FilterPrettyPrintMessages {

    comparisionOperationMessage(op: Ast.ComparisonOperationType, left: string, right: string): string;

    equalsOperationMessage(op: Ast.EqualsOperationType, left: string, right: string): string;

    rangeMessage(min: string, max: string): string ;

    andMessage(): string ;

    orMessage(): string ;

    propertyNameMessage(propertyName: string): string ;

    propertyValueItemMessage(propertyName: string, pv: PropertyValue.PropertyValue): string ;

    nullMessage(): string ;

}
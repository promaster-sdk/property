import { PropertyFilterAst as Ast, PropertyValue } from "promaster-primitives";
export declare function comparisionOperationMessage(op: Ast.ComparisonOperationType, left: string, right: string): string;
export declare function equalsOperationMessage(op: Ast.EqualsOperationType, left: string, right: string): string;
export declare function rangeMessage(min: string, max: string): string;
export declare function andMessage(): string;
export declare function orMessage(): string;
export declare function propertyNameMessage(propertyName: string): string;
export declare function propertyValueItemMessage(propertyName: string, pv: PropertyValue.PropertyValue): string;
export declare function nullMessage(): string;

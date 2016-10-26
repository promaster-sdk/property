import * as PropertyValueSet from "../product-properties/property-value-set";
import * as Ast from "./property-filter-ast";
export interface PropertyFilter {
    text: string;
    ast: Ast.Expr;
}
export declare const Empty: PropertyFilter;
export declare function fromString(filter: string): PropertyFilter | undefined;
export declare function fromStringOrEmpty(filterString: string): PropertyFilter;
export declare function isSyntaxValid(filter: string, propertyNames?: Array<string> | undefined): boolean;
export declare function isValid(properties: PropertyValueSet.PropertyValueSet, filter: PropertyFilter): boolean;
export declare function isValidMatchMissing(properties: PropertyValueSet.PropertyValueSet, filter: PropertyFilter): boolean;
export declare function getReferencedProperties(filter: PropertyFilter): Set<string>;
export declare function toString(filter: PropertyFilter): string;
export declare function equals(other: PropertyFilter, filter: PropertyFilter): boolean;
export declare function _evaluate(e: Ast.Expr, properties: PropertyValueSet.PropertyValueSet, matchMissingIdentifiers: boolean): any;

import * as PropertyValue from "../product-properties/property-value";
export declare type Expr = AndExpr | ComparisonExpr | EmptyExpr | EqualsExpr | IdentifierExpr | NullExpr | OrExpr | ValueExpr | ValueRangeExpr;
export declare function newAndExpr(children: Array<Expr>): AndExpr;
export declare function newComparisonExpr(leftValue: Expr, operationType: ComparisonOperationType, rightValue: Expr): ComparisonExpr;
export declare function newEmptyExpr(): EmptyExpr;
export declare function newEqualsExpr(leftValue: Expr, operationType: EqualsOperationType, rightValueRanges: Array<Expr>): EqualsExpr;
export declare function newIdentifierExpr(name: string): IdentifierExpr;
export declare function newNullExpr(): NullExpr;
export declare function newOrExpr(children: Array<Expr>): OrExpr;
export declare function newValueExpr(unParsed: string): ValueExpr;
export declare function newValueRangeExpr(min: Expr, max: Expr): ValueRangeExpr;
export interface AndExpr {
    type: "AndExpr";
    children: Array<Expr>;
}
export declare type ComparisonOperationType = "greater" | "less" | "greaterOrEqual" | "lessOrEqual";
export interface ComparisonExpr {
    type: "ComparisonExpr";
    leftValue: Expr;
    operationType: ComparisonOperationType;
    rightValue: Expr;
}
export interface EmptyExpr {
    type: "EmptyExpr";
}
export declare type EqualsOperationType = "equals" | "notEquals";
export interface EqualsExpr {
    type: "EqualsExpr";
    leftValue: Expr;
    operationType: EqualsOperationType;
    rightValueRanges: Array<Expr>;
}
export interface IdentifierExpr {
    type: "IdentifierExpr";
    name: string;
}
export interface NullExpr {
    type: "NullExpr";
}
export interface OrExpr {
    type: "OrExpr";
    children: Array<Expr>;
}
export interface ValueExpr {
    type: "ValueExpr";
    unParsed: string;
    parsed: PropertyValue.PropertyValue;
}
export interface ValueRangeExpr {
    type: "ValueRangeExpr";
    min: Expr;
    max: Expr;
}

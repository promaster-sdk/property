import * as Ast from "../property-filter-ast";
export declare type ParserCallbacks = {
    createValueExpr(unparsed: string): Ast.ValueExpr;
    createNullExpr(): Ast.NullExpr;
    createIdentifierExpr(identToken: string): Ast.IdentifierExpr;
    createValueRangeExpr(v1: Ast.Expr, v2: Ast.Expr): Ast.ValueRangeExpr;
    createEqualsExpr(leftValue: Ast.Expr, operationType: Ast.EqualsOperationType, rightValueRanges: Iterable<Ast.Expr>): Ast.EqualsExpr;
    createComparisonExpr(leftValue: Ast.Expr, operationType: Ast.ComparisonOperationType, rightValue: Ast.Expr): Ast.ComparisonExpr;
    createAndExpr(children: Iterable<Ast.Expr>): Ast.AndExpr;
    createOrExpr(children: Iterable<Ast.Expr>): Ast.OrExpr;
};
export declare const parserCallbacks: ParserCallbacks;
export declare function parse(text: string, throwOnInvalidSyntax?: boolean): Ast.Expr | undefined;

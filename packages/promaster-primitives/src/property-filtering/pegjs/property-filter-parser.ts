import * as Ast from "../property-filter-ast";
import * as Parser from "./generated-parser";

export type ParserCallbacks = {
	createValueExpr(unparsed: string): Ast.ValueExpr,
	createNullExpr(): Ast.NullExpr,
	createIdentifierExpr(identToken: string): Ast.IdentifierExpr,
	createValueRangeExpr(v1: Ast.Expr, v2: Ast.Expr): Ast.ValueRangeExpr,
	createEqualsExpr(leftValue: Ast.Expr, operationType: Ast.EqualsOperationType, rightValueRanges: Array<Ast.Expr>): Ast.EqualsExpr,
	createComparisonExpr(leftValue: Ast.Expr, operationType: Ast.ComparisonOperationType, rightValue: Ast.Expr): Ast.ComparisonExpr,
	createAndExpr(children: Array<Ast.Expr>): Ast.AndExpr,
	createOrExpr(children: Array<Ast.Expr>): Ast.OrExpr,
}

export const parserCallbacks: ParserCallbacks = {
	createValueExpr: (value_token: string): Ast.ValueExpr => Ast.newValueExpr(value_token),
	createNullExpr: (): Ast.NullExpr => Ast.newNullExpr(),
	createIdentifierExpr: (identToken: string): Ast.IdentifierExpr => Ast.newIdentifierExpr(identToken),
	createValueRangeExpr: (v1: Ast.Expr, v2: Ast.Expr): Ast.ValueRangeExpr => Ast.newValueRangeExpr(v1, v2),
	createEqualsExpr: (leftValue: Ast.Expr, operationType: Ast.EqualsOperationType, rightValueRanges: Array<Ast.Expr>): Ast.EqualsExpr => Ast.newEqualsExpr(leftValue, operationType, rightValueRanges),
	createComparisonExpr: (leftValue: Ast.Expr, operationType: Ast.ComparisonOperationType, rightValue: Ast.Expr): Ast.ComparisonExpr => Ast.newComparisonExpr(leftValue, operationType, rightValue),
	createAndExpr: (children: Array<Ast.Expr>): Ast.AndExpr => Ast.newAndExpr(children),
	createOrExpr: (children: Array<Ast.Expr>): Ast.OrExpr => Ast.newOrExpr(children)
};

const options = {
	startRule: 'start',
	tracer: undefined as string | undefined,
	callbacks: parserCallbacks
};

export function parse(text: string, throwOnInvalidSyntax: boolean = false): Ast.Expr | undefined {
	try {
		const result = Parser.parse(text, options);
		return result;
	}
	catch (error) {
		console.warn("An exception occured when parsing", error);
		if (throwOnInvalidSyntax)
			throw error;
		else
			return undefined;
	}
}

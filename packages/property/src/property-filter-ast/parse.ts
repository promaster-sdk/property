import * as Ast from "./types";
import * as Parser from "./pegjs/generated-parser";

type ParserCallbacks = {
  createValueExpr(unparsed: string): Ast.ValueExpr;
  createNullExpr(): Ast.NullExpr;
  createIdentifierExpr(identToken: string): Ast.IdentifierExpr;
  createValueRangeExpr(
    v1: Ast.PropertyValueExpr,
    v2: Ast.PropertyValueExpr
  ): Ast.ValueRangeExpr;
  createEqualsExpr(
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.EqualsOperationType,
    rightValueRanges: Array<Ast.ValueRangeExpr>
  ): Ast.EqualsExpr;
  createComparisonExpr(
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.ComparisonOperationType,
    rightValue: Ast.PropertyValueExpr
  ): Ast.ComparisonExpr;
  createAndExpr(children: Array<Ast.BooleanExpr>): Ast.AndExpr;
  createOrExpr(children: Array<Ast.BooleanExpr>): Ast.OrExpr;
};

const parserCallbacks: ParserCallbacks = {
  createValueExpr: (valueToken: string): Ast.ValueExpr =>
    Ast.newValueExpr(valueToken),
  createNullExpr: (): Ast.NullExpr => Ast.newNullExpr(),
  createIdentifierExpr: (identToken: string): Ast.IdentifierExpr =>
    Ast.newIdentifierExpr(identToken),
  createValueRangeExpr: (
    v1: Ast.PropertyValueExpr,
    v2: Ast.PropertyValueExpr
  ): Ast.ValueRangeExpr => Ast.newValueRangeExpr(v1, v2),
  createEqualsExpr: (
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.EqualsOperationType,
    rightValueRanges: Array<Ast.ValueRangeExpr>
  ): Ast.EqualsExpr =>
    Ast.newEqualsExpr(leftValue, operationType, rightValueRanges),
  createComparisonExpr: (
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.ComparisonOperationType,
    rightValue: Ast.PropertyValueExpr
  ): Ast.ComparisonExpr =>
    Ast.newComparisonExpr(leftValue, operationType, rightValue),
  createAndExpr: (children: Array<Ast.BooleanExpr>): Ast.AndExpr =>
    Ast.newAndExpr(children),
  createOrExpr: (children: Array<Ast.BooleanExpr>): Ast.OrExpr =>
    Ast.newOrExpr(children)
};

const options = {
  startRule: "start",
  tracer: undefined as string | undefined,
  callbacks: parserCallbacks
};

export function parse(
  text: string,
  throwOnInvalidSyntax: boolean = false
): Ast.BooleanExpr | undefined {
  try {
    const result = Parser.parse(text, options);
    return result;
  } catch (error) {
    console.warn("An exception occured when parsing", error); //tslint:disable-line
    if (throwOnInvalidSyntax) {
      throw error;
    } else {
      return undefined;
    }
  }
}

export function preProcessString(filter: string): string {
  if (filter === "" || filter.trim().length === 0) {
    return "";
  }

  // Remove whitespace, before/after
  filter = filter.trim();

  // Remove whitespace in the middle, but not in string literals
  let inString: boolean = false;
  let newFilter = "";
  for (let char of filter.split("")) {
    if (char === '"') {
      inString = !inString;
    }
    if (char !== " " || inString) {
      newFilter += char;
    }
  }
  filter = newFilter.toString();

  return filter;
}

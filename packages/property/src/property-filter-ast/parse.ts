/* eslint-disable functional/no-method-signature */
import { UnitMap } from "uom";
import * as Ast from "./types";
import * as Parser from "./pegjs/generated-parser";

type ParserCallbacks = {
  createValueExpr(unparsed: string): Ast.ValueExpr;
  createNullExpr(): Ast.NullExpr;
  createIdentifierExpr(identToken: string): Ast.IdentifierExpr;
  createValueRangeExpr(v1: Ast.PropertyValueExpr, v2: Ast.PropertyValueExpr): Ast.ValueRangeExpr;
  createEqualsExpr(
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.EqualsOperationType,
    rightValueRanges: ReadonlyArray<Ast.ValueRangeExpr>
  ): Ast.EqualsExpr;
  createComparisonExpr(
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.ComparisonOperationType,
    rightValue: Ast.PropertyValueExpr
  ): Ast.ComparisonExpr;
  createAndExpr(children: ReadonlyArray<Ast.BooleanExpr>): Ast.AndExpr;
  createOrExpr(children: ReadonlyArray<Ast.BooleanExpr>): Ast.OrExpr;
  createAddExpr(
    left: Ast.PropertyValueExpr,
    operationType: Ast.AddExprOperationType,
    right: Ast.PropertyValueExpr
  ): Ast.AddExpr;
  createMulExpr(
    left: Ast.PropertyValueExpr,
    operationType: Ast.MulExprOperationType,
    right: Ast.PropertyValueExpr
  ): Ast.MulExpr;
  createUnaryExpr(operationType: Ast.UnaryExprOperationType, value: Ast.PropertyValueExpr): Ast.UnaryExpr;
};

type ParserOptions = {
  readonly startRule: string;
  readonly tracer: string | undefined;
  readonly callbacks: ParserCallbacks;
};

function buildOptions(unitLookup: UnitMap.UnitLookup): ParserOptions {
  const parserCallbacks: ParserCallbacks = {
    createValueExpr: (unParsed: string) => Ast.newValueExpr(unParsed, unitLookup),
    createNullExpr: Ast.newNullExpr,
    createIdentifierExpr: Ast.newIdentifierExpr,
    createValueRangeExpr: Ast.newValueRangeExpr,
    createEqualsExpr: Ast.newEqualsExpr,
    createComparisonExpr: Ast.newComparisonExpr,
    createAndExpr: Ast.newAndExpr,
    createOrExpr: Ast.newOrExpr,
    createAddExpr: Ast.newAddExpr,
    createMulExpr: Ast.newMulExpr,
    createUnaryExpr: Ast.newUnaryExpr,
  };
  const options = {
    startRule: "start",
    tracer: undefined as string | undefined,
    callbacks: parserCallbacks,
  };
  return options;
}

export function parse(
  text: string,
  unitLookup: UnitMap.UnitLookup,
  throwOnInvalidSyntax: boolean = false
): Ast.BooleanExpr | undefined {
  try {
    const options = buildOptions(unitLookup);
    const result = Parser.parse(text, options);
    return result;
  } catch (error) {
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
  for (const char of filter.split("")) {
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

/* eslint-disable functional/no-method-signature */
import { Unit } from "uom";
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
  createUnaryExpr(
    operationType: Ast.UnaryExprOperationType,
    value: Ast.PropertyValueExpr
  ): Ast.UnaryExpr;
};

interface Options {
  readonly startRule: string;
  readonly tracer: undefined | string;
  readonly callbacks: ParserCallbacks;
}

function createOptions(units: Unit.UnitMap): Options {
  return {
    startRule: "start",
    tracer: undefined as string | undefined,
    callbacks: {
      createValueExpr: (unparsed: string) => Ast.newValueExpr(unparsed, units),
      createNullExpr: Ast.newNullExpr,
      createIdentifierExpr: Ast.newIdentifierExpr,
      createValueRangeExpr: Ast.newValueRangeExpr,
      createEqualsExpr: Ast.newEqualsExpr,
      createComparisonExpr: Ast.newComparisonExpr,
      createAndExpr: Ast.newAndExpr,
      createOrExpr: Ast.newOrExpr,
      createAddExpr: Ast.newAddExpr,
      createMulExpr: Ast.newMulExpr,
      createUnaryExpr: Ast.newUnaryExpr
    }
  };
}

export function parse(
  text: string,
  throwOnInvalidSyntax: boolean = false,
  units: Unit.UnitMap
): Ast.BooleanExpr | undefined {
  try {
    const result = Parser.parse(text, createOptions(units));
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

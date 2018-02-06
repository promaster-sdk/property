import * as PropertyValue from "../property-value";

// All expression
export type Expr = BooleanExpr | PropertyValueExpr;

// Expressions that result in a boolean
export type BooleanExpr =
  | AndExpr
  | OrExpr
  | EqualsExpr
  | ComparisonExpr
  | EmptyExpr;

// Expressions that result in a PropertyValue or null
export type PropertyValueExpr = IdentifierExpr | ValueExpr | NullExpr;

export function newAndExpr(children: Array<BooleanExpr>): AndExpr {
  return { type: "AndExpr", children };
}

export function newComparisonExpr(
  leftValue: PropertyValueExpr,
  operationType: ComparisonOperationType,
  rightValue: PropertyValueExpr
): ComparisonExpr {
  return { type: "ComparisonExpr", leftValue, operationType, rightValue };
}

export function newEmptyExpr(): EmptyExpr {
  return { type: "EmptyExpr" };
}

export function newEqualsExpr(
  leftValue: PropertyValueExpr,
  operationType: EqualsOperationType,
  rightValueRanges: Array<ValueRangeExpr>
): EqualsExpr {
  return { type: "EqualsExpr", leftValue, operationType, rightValueRanges };
}

export function newIdentifierExpr(name: string): IdentifierExpr {
  return { type: "IdentifierExpr", name };
}

export function newNullExpr(): NullExpr {
  return { type: "NullExpr" };
}

export function newOrExpr(children: Array<BooleanExpr>): OrExpr {
  return { type: "OrExpr", children };
}

export function newValueExpr(unParsed: string): ValueExpr {
  const parsed = PropertyValue.fromString(unParsed);
  if (parsed === undefined) {
    throw new Error(`Invalid property value ${unParsed}`);
  }
  return { type: "ValueExpr", unParsed, parsed };
}

export function newValueRangeExpr(
  min: PropertyValueExpr,
  max: PropertyValueExpr
): ValueRangeExpr {
  return { type: "ValueRangeExpr", min, max };
}

export interface AndExpr {
  readonly type: "AndExpr";
  readonly children: Array<BooleanExpr>;
}

export type ComparisonOperationType =
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual";

export interface ComparisonExpr {
  readonly type: "ComparisonExpr";
  readonly leftValue: PropertyValueExpr;
  readonly operationType: ComparisonOperationType;
  readonly rightValue: PropertyValueExpr;
}

export interface EmptyExpr {
  readonly type: "EmptyExpr";
}

export type EqualsOperationType = "equals" | "notEquals";

export interface EqualsExpr {
  readonly type: "EqualsExpr";
  readonly leftValue: PropertyValueExpr;
  readonly operationType: EqualsOperationType;
  readonly rightValueRanges: Array<ValueRangeExpr>;
}

export interface IdentifierExpr {
  readonly type: "IdentifierExpr";
  readonly name: string;
}

export interface NullExpr {
  readonly type: "NullExpr";
}

export interface OrExpr {
  readonly type: "OrExpr";
  readonly children: Array<BooleanExpr>;
}

export interface ValueExpr {
  readonly type: "ValueExpr";
  readonly unParsed: string;
  readonly parsed: PropertyValue.PropertyValue;
}

export interface ValueRangeExpr {
  readonly type: "ValueRangeExpr";
  readonly min: PropertyValueExpr;
  readonly max: PropertyValueExpr;
}

import * as PropertyValue from "../product-properties/property-value";

export type Expr = AndExpr | ComparisonExpr | EmptyExpr | EqualsExpr | IdentifierExpr | NullExpr | OrExpr | ValueExpr | ValueRangeExpr;

export function newAndExpr(children: Array<Expr>): AndExpr {
  return { type: "AndExpr", children };
}

export function newComparisonExpr(leftValue: Expr, operationType: ComparisonOperationType, rightValue: Expr): ComparisonExpr {
  return { type: "ComparisonExpr", leftValue, operationType, rightValue };
}

export function newEmptyExpr(): EmptyExpr {
  return { type: "EmptyExpr" };
}

export function newEqualsExpr(leftValue: Expr, operationType: EqualsOperationType, rightValueRanges: Array<Expr>): EqualsExpr {
  return { type: "EqualsExpr", leftValue, operationType, rightValueRanges };
}

export function newIdentifierExpr(name: string): IdentifierExpr {
  return { type: "IdentifierExpr", name };
}

export function newNullExpr(): NullExpr {
  return { type: "NullExpr" };
}

export function newOrExpr(children: Array<Expr>): OrExpr {
  return { type: "OrExpr", children };
}

export function newValueExpr(unParsed: string): ValueExpr {
  const parsed = PropertyValue.fromString(unParsed);
  if (parsed === undefined) {
    throw new Error(`Invalid property value ${unParsed}`);
  }
  return { type: "ValueExpr", unParsed, parsed };
}

export function newValueRangeExpr(min: Expr, max: Expr): ValueRangeExpr {
  return { type: "ValueRangeExpr", min, max };
}

export interface AndExpr {
  readonly type: "AndExpr",
  readonly children: Array<Expr>
}

export type ComparisonOperationType = "greater" | "less" | "greaterOrEqual" | "lessOrEqual";

export interface ComparisonExpr {
  readonly type: "ComparisonExpr",
  readonly leftValue: Expr,
  readonly operationType: ComparisonOperationType,
  readonly rightValue: Expr
}

export interface EmptyExpr {
  readonly type: "EmptyExpr",
}

export type EqualsOperationType = "equals" | "notEquals";

export interface EqualsExpr {
  readonly type: "EqualsExpr",
  readonly leftValue: Expr,
  readonly operationType: EqualsOperationType,
  readonly rightValueRanges: Array<Expr>,
}

export interface IdentifierExpr {
  readonly type: "IdentifierExpr",
  readonly name: string,
}

export interface NullExpr {
  readonly type: "NullExpr",
}

export interface OrExpr {
  readonly type: "OrExpr",
  readonly children: Array<Expr>,
}

export interface ValueExpr {
  readonly type: "ValueExpr",
  readonly unParsed: string,
  readonly parsed: PropertyValue.PropertyValue,
}

export interface ValueRangeExpr {
  readonly type: "ValueRangeExpr",
  readonly min: Expr,
  readonly max: Expr,
}

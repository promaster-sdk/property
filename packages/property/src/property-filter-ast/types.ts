import { Unit } from "uom";
import * as PropertyValue from "../property-value";

// All expression
export type Expr = BooleanExpr | PropertyValueExpr | ValueRangeExpr;

// Expressions that result in a boolean
export type BooleanExpr =
  | OrExpr
  | AndExpr
  | EqualsExpr
  | ComparisonExpr
  | EmptyExpr;

export interface OrExpr {
  readonly type: "OrExpr";
  readonly children: ReadonlyArray<BooleanExpr>;
}

export function newOrExpr(children: Array<BooleanExpr>): OrExpr {
  return { type: "OrExpr", children };
}

export interface AndExpr {
  readonly type: "AndExpr";
  readonly children: ReadonlyArray<BooleanExpr>;
}

export function newAndExpr(children: Array<BooleanExpr>): AndExpr {
  return { type: "AndExpr", children };
}

export interface EmptyExpr {
  readonly type: "EmptyExpr";
}

export function newEmptyExpr(): EmptyExpr {
  return { type: "EmptyExpr" };
}

export interface EqualsExpr {
  readonly type: "EqualsExpr";
  readonly leftValue: PropertyValueExpr;
  readonly operationType: EqualsOperationType;
  readonly rightValueRanges: ReadonlyArray<ValueRangeExpr>;
}

export type EqualsOperationType = "equals" | "notEquals";

export function newEqualsExpr(
  leftValue: PropertyValueExpr,
  operationType: EqualsOperationType,
  rightValueRanges: Array<ValueRangeExpr>
): EqualsExpr {
  return { type: "EqualsExpr", leftValue, operationType, rightValueRanges };
}

export interface ValueRangeExpr {
  readonly type: "ValueRangeExpr";
  readonly min: PropertyValueExpr;
  readonly max: PropertyValueExpr;
}

export function newValueRangeExpr(
  min: PropertyValueExpr,
  max: PropertyValueExpr
): ValueRangeExpr {
  return { type: "ValueRangeExpr", min, max };
}

export interface ComparisonExpr {
  readonly type: "ComparisonExpr";
  readonly leftValue: PropertyValueExpr;
  readonly operationType: ComparisonOperationType;
  readonly rightValue: PropertyValueExpr;
}

export type ComparisonOperationType =
  | "greater"
  | "less"
  | "greaterOrEqual"
  | "lessOrEqual";

export function newComparisonExpr(
  leftValue: PropertyValueExpr,
  operationType: ComparisonOperationType,
  rightValue: PropertyValueExpr
): ComparisonExpr {
  return { type: "ComparisonExpr", leftValue, operationType, rightValue };
}

export type PropertyValueExpr =
  | IdentifierExpr
  | ValueExpr
  | NullExpr
  | AddExpr
  | MulExpr
  | UnaryExpr;

export interface IdentifierExpr {
  readonly type: "IdentifierExpr";
  readonly name: string;
}

export function newIdentifierExpr(name: string): IdentifierExpr {
  return { type: "IdentifierExpr", name };
}

export interface ValueExpr {
  readonly type: "ValueExpr";
  readonly unParsed: string;
  readonly parsed: PropertyValue.PropertyValue;
}

export function newValueExpr(
  unParsed: string,
  unitLookup: Unit.UnitLookup
): ValueExpr {
  const parsed = PropertyValue.fromString(unParsed, unitLookup);
  if (parsed === undefined) {
    throw new Error(`Invalid property value ${unParsed}`);
  }
  if (parsed.type === "integer" && unParsed.includes(".")) {
    return {
      type: "ValueExpr",
      unParsed,
      parsed: PropertyValue.fromInteger(parseFloat(unParsed))
    };
  }
  return { type: "ValueExpr", unParsed, parsed };
}

export interface NullExpr {
  readonly type: "NullExpr";
}

export function newNullExpr(): NullExpr {
  return { type: "NullExpr" };
}

export interface AddExpr {
  readonly type: "AddExpr";
  readonly left: PropertyValueExpr;
  readonly operationType: AddExprOperationType;
  readonly right: PropertyValueExpr;
}

export type AddExprOperationType = "add" | "subtract";

export function newAddExpr(
  left: PropertyValueExpr,
  operationType: AddExprOperationType,
  right: PropertyValueExpr
): AddExpr {
  return { type: "AddExpr", left, operationType, right };
}

export interface MulExpr {
  readonly type: "MulExpr";
  readonly left: PropertyValueExpr;
  readonly operationType: MulExprOperationType;
  readonly right: PropertyValueExpr;
}

export type MulExprOperationType = "multiply" | "divide";

export function newMulExpr(
  left: PropertyValueExpr,
  operationType: MulExprOperationType,
  right: PropertyValueExpr
): MulExpr {
  return { type: "MulExpr", left, operationType, right };
}

export type UnaryExprOperationType = "negative";

export interface UnaryExpr {
  readonly type: "UnaryExpr";
  readonly operationType: UnaryExprOperationType;
  readonly value: PropertyValueExpr;
}

export function newUnaryExpr(
  operationType: UnaryExprOperationType,
  value: PropertyValueExpr
): UnaryExpr {
  return {
    type: "UnaryExpr",
    operationType,
    value
  };
}

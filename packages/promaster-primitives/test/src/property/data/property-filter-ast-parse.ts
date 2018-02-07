// import * as Ast from "../../../src/property/property-filter-ast";
import {
  EqualsExpr,
  ComparisonExpr,
  newIdentifierExpr,
  newValueExpr,
  newEqualsExpr,
  newValueRangeExpr,
  newComparisonExpr
} from "../../../../src/property/property-filter-ast";

// https://github.com/Microsoft/TypeScript/issues/9944
((_?: EqualsExpr, __?: ComparisonExpr) => 0)();

export const tests = [
  {
    name: "should_parse_a_equals_1",
    f: "a=1",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("1"), newValueExpr("1"))
    ])
  },
  {
    name: "should_parse_a_greater_than_1",
    f: "a>1",
    result: newComparisonExpr(
      newIdentifierExpr("a"),
      "greater",
      newValueExpr("1")
    )
  },
  {
    name: "should_parse_a_greater_or_equal_to_1",
    f: "a>=1",
    result: newComparisonExpr(
      newIdentifierExpr("a"),
      "greaterOrEqual",
      newValueExpr("1")
    )
  },
  {
    name: "should_parse_a_dot_b_equals_1",
    f: "a.b=1",
    result: newEqualsExpr(newIdentifierExpr("a.b"), "equals", [
      newValueRangeExpr(newValueExpr("1"), newValueExpr("1"))
    ])
  },
  {
    name: "should_parse_a_equals_20_Celsius",
    f: "a=20:Celsius",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("20:Celsius"), newValueExpr("20:Celsius"))
    ])
  },
  {
    name: "should_parse_a_equals_20_Celsius_range_30_Celsius",
    f: "a=20:Celsius~30:Celsius",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("20:Celsius"), newValueExpr("30:Celsius"))
    ])
  }
];

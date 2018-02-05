import * as Ast from "../../../src/property/property-filter-ast";
import {
  EqualsExpr,
  newIdentifierExpr,
  newValueExpr,
  ComparisonExpr
} from "../../../src/property/property-filter-ast";

export const tests = [
  {
    name: "should_parse_a_equals_1",
    f: "a=1",
    result: Ast.newEqualsExpr(Ast.newIdentifierExpr("a"), "equals", [
      Ast.newValueRangeExpr(Ast.newValueExpr("1"), Ast.newValueExpr("1"))
    ])
  },
  {
    name: "should_parse_a_greater_than_1",
    f: "a>1",
    result: Ast.newComparisonExpr(
      Ast.newIdentifierExpr("a"),
      "greater",
      Ast.newValueExpr("1")
    )
  },
  {
    name: "should_parse_a_greater_or_equal_to_1",
    f: "a>=1",
    result: Ast.newComparisonExpr(
      Ast.newIdentifierExpr("a"),
      "greaterOrEqual",
      Ast.newValueExpr("1")
    )
  },
  {
    name: "should_parse_a_dot_b_equals_1",
    f: "a.b=1",
    result: Ast.newEqualsExpr(Ast.newIdentifierExpr("a.b"), "equals", [
      Ast.newValueRangeExpr(Ast.newValueExpr("1"), Ast.newValueExpr("1"))
    ])
  },
  {
    name: "should_parse_a_equals_20_Celsius",
    f: "a=20:Celsius",
    result: Ast.newEqualsExpr(Ast.newIdentifierExpr("a"), "equals", [
      Ast.newValueRangeExpr(
        Ast.newValueExpr("20:Celsius"),
        Ast.newValueExpr("20:Celsius")
      )
    ])
  },
  {
    name: "should_parse_a_equals_20_Celsius_range_30_Celsius",
    f: "a=20:Celsius~30:Celsius",
    result: Ast.newEqualsExpr(Ast.newIdentifierExpr("a"), "equals", [
      Ast.newValueRangeExpr(
        Ast.newValueExpr("20:Celsius"),
        Ast.newValueExpr("30:Celsius")
      )
    ])
  }
];

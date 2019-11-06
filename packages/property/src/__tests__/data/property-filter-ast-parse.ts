import { Units } from "uom-units";
import * as PropertyFilterAst from "../../property-filter-ast";

const {
  newIdentifierExpr,
  newValueExpr,
  newEqualsExpr,
  newValueRangeExpr,
  newComparisonExpr,
  newAddExpr
} = PropertyFilterAst;

export const tests = [
  {
    name: "should_parse_a_equals_1",
    f: "a=1",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("1", {}), newValueExpr("1", {}))
    ])
  },
  {
    name: "should_parse_a_greater_than_1",
    f: "a>1",
    result: newComparisonExpr(
      newIdentifierExpr("a"),
      "greater",
      newValueExpr("1", {})
    )
  },
  {
    name: "should_parse_a_greater_or_equal_to_1",
    f: "a>=1",
    result: newComparisonExpr(
      newIdentifierExpr("a"),
      "greaterOrEqual",
      newValueExpr("1", {})
    )
  },
  {
    name: "should_parse_a_dot_b_equals_1",
    f: "a.b=1",
    result: newEqualsExpr(newIdentifierExpr("a.b"), "equals", [
      newValueRangeExpr(newValueExpr("1", {}), newValueExpr("1", {}))
    ])
  },
  {
    name: "should_parse_a_equals_20_Meter",
    f: "a=20:Meter",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(
        newValueExpr("20:Meter", Units),
        newValueExpr("20:Meter", Units)
      )
    ])
  },
  {
    name: "should_parse_a_equals_20_Meters_range_30_Meter",
    f: "a=20:Meter~30:Meter",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(
        newValueExpr("20:Meter", Units),
        newValueExpr("30:Meter", Units)
      )
    ])
  },
  {
    name: "should_parse_addition",
    f: "1+1=2",
    result: newEqualsExpr(
      newAddExpr(newValueExpr("1", {}), "add", newValueExpr("1", {})),
      "equals",
      [newValueRangeExpr(newValueExpr("2", {}), newValueExpr("2", {}))]
    )
  }
];

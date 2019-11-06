import { BaseUnits, Unit } from "uom";
import * as PropertyFilterAst from "../../property-filter-ast";

const {
  newIdentifierExpr,
  newValueExpr,
  newEqualsExpr,
  newValueRangeExpr,
  newComparisonExpr,
  newAddExpr
} = PropertyFilterAst;

const customUnitMap = {
  MyCustomUnit: Unit.createBase<"Foo">("MyCustomUnit", "Foo", "FooSymbol")
};

export const tests = [
  {
    name: "should_parse_a_equals_1",
    f: "a=1",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(
        newValueExpr("1", BaseUnits),
        newValueExpr("1", BaseUnits)
      )
    ])
  },
  {
    name: "should_parse_a_greater_than_1",
    f: "a>1",
    result: newComparisonExpr(
      newIdentifierExpr("a"),
      "greater",
      newValueExpr("1", BaseUnits)
    )
  },
  {
    name: "should_parse_a_greater_or_equal_to_1",
    f: "a>=1",
    result: newComparisonExpr(
      newIdentifierExpr("a"),
      "greaterOrEqual",
      newValueExpr("1", BaseUnits)
    )
  },
  {
    name: "should_parse_a_dot_b_equals_1",
    f: "a.b=1",
    result: newEqualsExpr(newIdentifierExpr("a.b"), "equals", [
      newValueRangeExpr(
        newValueExpr("1", BaseUnits),
        newValueExpr("1", BaseUnits)
      )
    ])
  },
  {
    name: "should_parse_a_equals_20_Meter",
    f: "a=20:Meter",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(
        newValueExpr("20:Meter", BaseUnits),
        newValueExpr("20:Meter", BaseUnits)
      )
    ])
  },
  {
    name: "should_parse_a_equals_20_Meters_range_30_Meter",
    f: "a=20:Meter~30:Meter",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(
        newValueExpr("20:Meter", BaseUnits),
        newValueExpr("30:Meter", BaseUnits)
      )
    ])
  },
  {
    name: "should_parse_addition",
    f: "1+1=2",
    result: newEqualsExpr(
      newAddExpr(
        newValueExpr("1", BaseUnits),
        "add",
        newValueExpr("1", BaseUnits)
      ),
      "equals",
      [
        newValueRangeExpr(
          newValueExpr("2", BaseUnits),
          newValueExpr("2", BaseUnits)
        )
      ]
    )
  },
  {
    name: "should_parse_with_custom_unit",
    f: "a=0:MyCustomUnit",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(
        newValueExpr("0:MyCustomUnit", customUnitMap),
        newValueExpr("0:MyCustomUnit", customUnitMap)
      )
    ])
  }
];

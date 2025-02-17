import { BaseUnits, Unit, UnitMap } from "uom";
// import * as ParseData from "../data/property-filter-ast-parse";
import * as PropertyFilterAst from "../../property-filter-ast";

const {
  newIdentifierExpr,
  newValueExpr,
  newEqualsExpr,
  newValueRangeExpr,
  newComparisonExpr,
  newAddExpr,
} = PropertyFilterAst;

const customUnitMap: UnitMap.UnitMap = {
  ...BaseUnits,
  MyCustomUnit: Unit.createBase<"Foo">("MyCustomUnit", "Foo", "FooSymbol"),
};

export const unitLookup: UnitMap.UnitLookup = (unitString) => customUnitMap[unitString];

export const tests = [
  {
    name: "should_parse_a_equals_1",
    f: "a=1",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("1", unitLookup), newValueExpr("1", unitLookup)),
    ]),
  },
  {
    name: "should_parse_a_equals_1_with_space",
    f: "a = 1",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("1", unitLookup), newValueExpr("1", unitLookup)),
    ]),
  },
  {
    name: "should_parse_a_greater_than_1",
    f: "a>1",
    result: newComparisonExpr(newIdentifierExpr("a"), "greater", newValueExpr("1", unitLookup)),
  },
  {
    name: "should_parse_a_greater_or_equal_to_1",
    f: "a>=1",
    result: newComparisonExpr(newIdentifierExpr("a"), "greaterOrEqual", newValueExpr("1", unitLookup)),
  },
  {
    name: "should_parse_a_dot_b_equals_1",
    f: "a.b=1",
    result: newEqualsExpr(newIdentifierExpr("a.b"), "equals", [
      newValueRangeExpr(newValueExpr("1", unitLookup), newValueExpr("1", unitLookup)),
    ]),
  },
  {
    name: "should_parse_a_equals_20_Meter",
    f: "a=20:Meter",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("20:Meter", unitLookup), newValueExpr("20:Meter", unitLookup)),
    ]),
  },
  {
    name: "should_parse_a_equals_20_Meters_range_30_Meter",
    f: "a=20:Meter~30:Meter",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("20:Meter", unitLookup), newValueExpr("30:Meter", unitLookup)),
    ]),
  },
  {
    name: "should_parse_a_equals_20_Meters_range_30_Meter_with_space",
    f: "a = 20:Meter ~ 30:Meter",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("20:Meter", unitLookup), newValueExpr("30:Meter", unitLookup)),
    ]),
  },
  {
    name: "should_parse_a_equals_1_range_2_with_space",
    f: "a = 1 ~ 2",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("1", unitLookup), newValueExpr("2", unitLookup)),
    ]),
  },
  {
    name: "should_parse_addition",
    f: "1+1=2",
    result: newEqualsExpr(newAddExpr(newValueExpr("1", unitLookup), "add", newValueExpr("1", unitLookup)), "equals", [
      newValueRangeExpr(newValueExpr("2", unitLookup), newValueExpr("2", unitLookup)),
    ]),
  },
  {
    name: "should_parse_addition_with_space",
    f: "1 + 1 = 2",
    result: newEqualsExpr(newAddExpr(newValueExpr("1", unitLookup), "add", newValueExpr("1", unitLookup)), "equals", [
      newValueRangeExpr(newValueExpr("2", unitLookup), newValueExpr("2", unitLookup)),
    ]),
  },
  {
    name: "should_parse_with_custom_unit",
    f: "a=0:MyCustomUnit",
    result: newEqualsExpr(newIdentifierExpr("a"), "equals", [
      newValueRangeExpr(newValueExpr("0:MyCustomUnit", unitLookup), newValueExpr("0:MyCustomUnit", unitLookup)),
    ]),
  },
  // {
  //   name: "new_line_equsl",
  //   f: "ccc=20|a=1,2&\n\n\n\nd=5|z=50",
  //   result: PropertyFilterAst.parse("ccc=20|a=1,2&d=5|z=50", ParseData.unitLookup),
  // },
];

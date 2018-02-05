import { assert } from "chai";
import * as Ast from "../../src/property/property-filter-ast";

describe("parser_tests", () => {
  it("should_not_accept_d", () => {
    const result = Ast.parse("bbb=1|abc123=1&def456=1&ghi789=1");
    assert.notEqual(result, undefined);
  });

  it("should_parse_a_equals_1", () => {
    const result = Ast.parse("a>=1");
    assert.notEqual(result, undefined);
  });
});

describe("parsing", () => {
  it("should_parse_a_equals_1", () => {
    const ast = Ast.parse("a=1");
    assert.deepEqual(
      ast,
      Ast.newEqualsExpr(Ast.newIdentifierExpr("a"), "equals", [
        Ast.newValueRangeExpr(Ast.newValueExpr("1"), Ast.newValueExpr("1"))
      ])
    );
  });

  it("should_parse_a_greater_than_1", () => {
    const ast = Ast.parse("a>1");
    assert.deepEqual(
      ast,
      Ast.newComparisonExpr(
        Ast.newIdentifierExpr("a"),
        "greater",
        Ast.newValueExpr("1")
      )
    );
  });

  it("should_parse_a_greater_or_equal_to_1", () => {
    const ast = Ast.parse("a>=1");
    assert.deepEqual(
      ast,
      Ast.newComparisonExpr(
        Ast.newIdentifierExpr("a"),
        "greaterOrEqual",
        Ast.newValueExpr("1")
      )
    );
  });

  it("should_parse_a_dot_b_equals_1", () => {
    const ast = Ast.parse("a.b=1");
    assert.deepEqual(
      ast,
      Ast.newEqualsExpr(Ast.newIdentifierExpr("a.b"), "equals", [
        Ast.newValueRangeExpr(Ast.newValueExpr("1"), Ast.newValueExpr("1"))
      ])
    );
  });

  it("should_parse_a_equals_20_Celsius", () => {
    const ast = Ast.parse("a=20:Celsius");
    assert.deepEqual(
      ast,
      Ast.newEqualsExpr(Ast.newIdentifierExpr("a"), "equals", [
        Ast.newValueRangeExpr(
          Ast.newValueExpr("20:Celsius"),
          Ast.newValueExpr("20:Celsius")
        )
      ])
    );
  });

  it("should_parse_a_equals_20_Celsius_range_30_Celsius", () => {
    const ast = Ast.parse("a=20:Celsius~30:Celsius");
    assert.deepEqual(
      ast,
      Ast.newEqualsExpr(Ast.newIdentifierExpr("a"), "equals", [
        Ast.newValueRangeExpr(
          Ast.newValueExpr("20:Celsius"),
          Ast.newValueExpr("30:Celsius")
        )
      ])
    );
  });
});

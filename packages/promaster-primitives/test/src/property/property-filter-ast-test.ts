import { assert } from "chai";
import * as Ast from "../../../src/property/property-filter-ast";
import * as PropertyValueSet from "../../../src/property/property-value-set";
import { BooleanExpr } from "../../../src/property/property-filter-ast";
import * as ParseData from "./data/property-filter-ast-parse";
import * as IsValidData from "./data/property-filter-isvalid";

describe("PropertyFilterAst", () => {
  describe("parse", () => {
    ParseData.tests.forEach(test => {
      it(test.name, () => {
        const ast = Ast.parse(test.f);
        assert.deepEqual(ast, test.result);
      });
    });
  });

  describe("evaluate with raw AST", () => {
    IsValidData.tests.forEach(test => {
      it(test.name, () => {
        const pvs = PropertyValueSet.fromString(test.pvs);
        const f = fromStringOrException(test.f);
        assert.equal(Ast.evaluateAst(f, pvs, false), test.result);
      });
    });
  });

  describe("evaluate with compiled AST", () => {
    IsValidData.tests.forEach(test => {
      it(test.name, () => {
        const pvs = PropertyValueSet.fromString(test.pvs);
        const f = fromStringOrException(test.f);
        const func = Ast.compileAst(f);
        assert.equal(func(pvs), test.result);
      });
    });
  });

  // describe("evaluate with lambda", () => {
  //   IsValidData.tests.forEach(test => {
  //     it(test.name, () => {
  //       const pvs = PropertyValueSet.fromString(test.pvs);
  //       const f = fromStringOrException(test.f);
  //       const lamda = Ast.compileToLambdas(f);
  //       assert.equal(lamda(pvs), test.result);
  //     });
  //   });
  // });
});

function fromStringOrException(filter: string): BooleanExpr {
  const f = Ast.parse(filter);
  if (f === undefined) {
    throw new Error(`Could not parse property filter "${filter}".`);
  }
  return f;
}

import { UnitMap } from "uom";
import * as Ast from "../property-filter-ast";
import * as PropertyValueSet from "../property-value-set";
import * as PropertyValue from "../property-value";
import * as ParseData from "./data/property-filter-ast-parse";
import * as IsValidData from "./data/property-filter-isvalid";

describe("PropertyFilterAst", () => {
  describe("parse", () => {
    ParseData.tests.forEach((test) => {
      it(test.name, () => {
        const ast = Ast.parse(test.f, ParseData.unitLookup);
        expect(ast).toEqual(test.result);
      });
    });
  });

  describe("evaluate with raw AST", () => {
    IsValidData.tests.forEach((test) => {
      it(test.name, () => {
        const pvs = PropertyValueSet.fromString(test.pvs, ParseData.unitLookup);
        const f = fromStringOrException(test.f, ParseData.unitLookup);
        expect(Ast.evaluateAst(f, pvs, false, test.comparer || PropertyValue.defaultComparer)).toBe(test.result);
      });
    });
  });

  describe("evaluate with compiled AST", () => {
    IsValidData.tests.forEach((test) => {
      it(test.name, () => {
        const pvs = PropertyValueSet.fromString(test.pvs, ParseData.unitLookup);
        const f = fromStringOrException(test.f, ParseData.unitLookup);
        const func = Ast.compileAst(f);
        expect(func(pvs, test.comparer || PropertyValue.defaultComparer)).toBe(test.result);
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

  describe("exception", () => {
    it("parse should give exception", () => {
      expect(isException("a=1 000", ParseData.unitLookup)).toBe(true);
    });
  });
});

function fromStringOrException(filter: string, unitLookup: UnitMap.UnitLookup): Ast.BooleanExpr {
  const f = Ast.parse(filter, unitLookup);
  if (f === undefined) {
    throw new Error(`Could not parse property filter "${filter}".`);
  }
  return f;
}

function isException(filter: string, unitLookup: UnitMap.UnitLookup): boolean {
  try {
    Ast.parse(filter, unitLookup, true);
    return false;
  } catch (error) {
    return true;
  }
}

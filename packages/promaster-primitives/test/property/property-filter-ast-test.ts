import { assert } from "chai";
import * as Ast from "../../src/property/property-filter-ast";
import * as ParseData from "./data/property-filter-ast-parse";

describe("PropertyFilterAst", () => {
  describe("parse", () => {
    ParseData.tests.forEach(test => {
      it(test.name, () => {
        const ast = Ast.parse(test.f);
        assert.deepEqual(ast, test.result);
      });
    });
  });
});

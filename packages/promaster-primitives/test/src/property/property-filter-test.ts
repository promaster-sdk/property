import { assert } from "chai";
import * as PropertyFilter from "../../../src/property/property-filter";
import * as PropertyValueSet from "../../../src/property/property-value-set";
import * as IsValidData from "./data/property-filter-isvalid";
import * as IsSyntaxValidData from "./data/property-filter-is-syntax-valid";

describe("PropertyFilter", () => {
  describe("isSyntaxValid", () => {
    IsSyntaxValidData.tests.forEach(test => {
      it(test.name, () => {
        assert.equal(PropertyFilter.isSyntaxValid(test.f), test.result);
      });
    });
  });

  describe("isValid", () => {
    IsValidData.tests.forEach(test => {
      it(test.name, () => {
        const pvs = PropertyValueSet.fromString(test.pvs);
        const f = fromStringOrException(test.f);
        assert.equal(PropertyFilter.isValid(pvs, f), test.result);
      });
    });
  });

  describe("getReferencedProperties", () => {
    it("should return referenced properties", () => {
      const filter = fromStringOrException("a>b&c=1|d<2");
      const references = PropertyFilter.getReferencedProperties(filter);
      assert.equal(references.length, 4);
    });
  });

  describe("equals", () => {
    it("should see two PropertyFilters with same values as equal", () => {
      const filter1 = fromStringOrException("a>b&c=1|d<2");
      const filter2 = fromStringOrException("a>b&c=1|d<2");
      assert.equal(PropertyFilter.equals(filter2, filter1), true);
    });
  });
});

function fromStringOrException(filter: string): PropertyFilter.PropertyFilter {
  const f = PropertyFilter.fromString(filter);
  if (f === undefined) {
    throw new Error(`Could not parse property filter "${filter}".`);
  }
  return f;
}

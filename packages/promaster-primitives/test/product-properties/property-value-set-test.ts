import { assert } from "chai";
import * as PropertyValueSet from "../../src/product-properties/property-value-set";
import * as PropertyValue from "../../src/product-properties/property-value";
import * as Units from "../../src/measure/units";
import * as Amount from "../../src/measure/amount";

describe("property_value_set_test", () => {
  describe("getValue", () => {
    it("should get text value", () => {
      let pvs = PropertyValueSet.fromString('message="MyMessage"');
      assert.deepEqual(
        PropertyValueSet.getValue("message", pvs),
        PropertyValue.fromText("MyMessage")
      );
    });

    it("should get integer value", () => {
      let pvs = PropertyValueSet.fromString("message=12");
      assert.deepEqual(
        PropertyValueSet.getValue("message", pvs),
        PropertyValue.fromInteger(12)
      );
    });

    it("should get amount value", () => {
      let pvs = PropertyValueSet.fromString("message=12:Celsius");
      assert.deepEqual(
        PropertyValueSet.getValue("message", pvs),
        PropertyValue.fromAmount(Amount.create(12, Units.Celsius, 0))
      );
    });

    it("should_get_default_if_type_is_not_matching", () => {
      const pvs = PropertyValueSet.fromString("a=10:Celsius");
      const pv2 = PropertyValueSet.getInteger("a", pvs);
      assert.equal(pv2, null);
    });
  });

  describe("parsing", () => {
    it("should parse a=1", () => {
      let pvs = PropertyValueSet.fromString("a=1");
      assert.deepEqual(
        PropertyValueSet.get("a", pvs),
        PropertyValue.fromInteger(1)
      );
    });

    it("should parse a=1;b=2;", () => {
      let pvs = PropertyValueSet.fromString("a=1;b=2;");
      assert.deepEqual(
        PropertyValueSet.get("a", pvs),
        PropertyValue.fromInteger(1)
      );
      assert.deepEqual(
        PropertyValueSet.get("b", pvs),
        PropertyValue.fromInteger(2)
      );
    });
  });

  describe("set", () => {
    it("should set the specified property", () => {
      let pvs = PropertyValueSet.fromString("a=1;b=2;c=3");
      let pvs2 = PropertyValueSet.set("b", PropertyValue.fromInteger(5), pvs);
      assert.deepEqual(
        PropertyValueSet.get("a", pvs2),
        PropertyValue.fromInteger(1)
      );
      assert.deepEqual(
        PropertyValueSet.get("b", pvs2),
        PropertyValue.fromInteger(5)
      );
      assert.deepEqual(
        PropertyValueSet.get("c", pvs2),
        PropertyValue.fromInteger(3)
      );
    });
  });

  describe("setInteger", () => {
    it("should set the specified property", () => {
      let pvs = PropertyValueSet.fromString("a=1;b=2;c=3");
      let pvs2 = PropertyValueSet.setInteger("b", 5, pvs);
      assert.deepEqual(
        PropertyValueSet.get("a", pvs2),
        PropertyValue.fromInteger(1)
      );
      assert.deepEqual(
        PropertyValueSet.get("b", pvs2),
        PropertyValue.fromInteger(5)
      );
      assert.deepEqual(
        PropertyValueSet.get("c", pvs2),
        PropertyValue.fromInteger(3)
      );
    });
  });

  describe("setAmount", () => {
    it("should set the specified property", () => {
      let pvs = PropertyValueSet.fromString("a=1;b=2;c=3");
      let pvs2 = PropertyValueSet.setAmount(
        "b",
        Amount.create(12, Units.Celsius),
        pvs
      );
      assert.deepEqual(PropertyValueSet.getInteger("a", pvs2), 1);
      const a1 = PropertyValueSet.getAmount("b", pvs2);
      if (a1 === undefined) {
        assert.fail();
        return;
      }
      assert(Amount.equals(a1, Amount.create(12, Units.Celsius)));
      assert.deepEqual(PropertyValueSet.getInteger("c", pvs2), 3);
    });
  });

  describe("equals", () => {
    it("should see two sets with same keys and values as equal regardless of order", () => {
      let pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      let pvs2 = PropertyValueSet.fromString("c=3;b=2;a=1");
      assert.equal(PropertyValueSet.equals(pvs1, pvs2), true);
    });

    it("should see two sets with same keys but different values as unequal", () => {
      let pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      let pvs2 = PropertyValueSet.fromString("a=1;b=2;c=4");
      assert.equal(PropertyValueSet.equals(pvs1, pvs2), false);
    });

    it("should see two sets with differnet keys as unequal", () => {
      let pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      let pvs2 = PropertyValueSet.fromString("a=1;b=2");
      assert.equal(PropertyValueSet.equals(pvs1, pvs2), false);
    });
  });

  describe("toString", () => {
    it("toString should result in a valid set, equal to the original", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      const str1 = PropertyValueSet.toString(pvs1);
      const pvs2 = PropertyValueSet.fromString(str1);
      assert.equal(PropertyValueSet.equals(pvs1, pvs2), true);
    });
  });

  describe("isEmpty", () => {
    it("it should return true on empty object", () => {
      const pvs1 = PropertyValueSet.fromString("");
      assert.isTrue(PropertyValueSet.isEmpty(pvs1));
    });

    it("it should return true on undefined", () => {
      assert.isTrue(PropertyValueSet.isEmpty(undefined));
    });

    it("it should return true on null", () => {
      assert.isTrue(PropertyValueSet.isEmpty(null));
    });

    it("it should return false on non empty object", () => {
      const pvs1 = PropertyValueSet.fromString("a=1");
      assert.isFalse(PropertyValueSet.isEmpty(pvs1));
    });
  });
});

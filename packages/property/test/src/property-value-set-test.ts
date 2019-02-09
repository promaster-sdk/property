import { assert } from "chai";
import * as PropertyValueSet from "../../src/property-value-set";
import * as PropertyValue from "../../src/property-value";
import { Units, Amount } from "uom";

describe("PropertyValueSet", () => {
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

    it("toString should remove properties with null or undefined value", () => {
      const pvs1 = {
        a: PropertyValue.fromInteger(1),
        b: PropertyValue.fromInteger(2),
        c: null,
        d: undefined
        // tslint:disable-next-line:no-any
      } as any;
      const str1 = PropertyValueSet.toString(pvs1);
      assert.equal("a=1;b=2", str1);
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

  describe("keepProperties", () => {
    it("it should remove unwanted properties", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      const propertyNamesToKeep: Array<string> = ["a", "c"];
      const resultingPvs = PropertyValueSet.keepProperties(
        propertyNamesToKeep,
        pvs1
      );
      const resultingPvsString = PropertyValueSet.toString(resultingPvs);
      assert.equal("a=1;c=3", resultingPvsString);
    });
    it("it should not add any properties", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;c=3");
      const propertyNamesToKeep: Array<string> = ["a", "b", "c"];
      const resultingPvs = PropertyValueSet.keepProperties(
        propertyNamesToKeep,
        pvs1
      );
      const resultingPvsString = PropertyValueSet.toString(resultingPvs);
      assert.equal("a=1;c=3", resultingPvsString);
    });
  });

  describe("filter", () => {
    it("it should filter based on key", () => {
      const pvs1 = PropertyValueSet.fromString("pp_a=1;b=2;pp_c=3");
      const resultingPvs = PropertyValueSet.filter(
        kvp => !kvp.key.startsWith("pp_"),
        pvs1
      );
      const pvs2 = PropertyValueSet.fromString("b=2");
      assert.isTrue(PropertyValueSet.equals(resultingPvs, pvs2));
    });
    it("it should filter based on value", () => {
      const pvs1 = PropertyValueSet.fromString(
        'a=10:Celsius;b="test";c=13:Celsius;d=4'
      );
      const resultingPvs = PropertyValueSet.filter(
        kvp =>
          kvp.value.type === "amount" &&
          Amount.lessThan(kvp.value.value, Amount.create(12, Units.Celsius)),
        pvs1
      );
      const pvs2 = PropertyValueSet.fromString("a=10:Celsius");
      assert.isTrue(PropertyValueSet.equals(resultingPvs, pvs2));
    });
  });

  describe("map", () => {
    it("it should map based on key", () => {
      const pvs1 = PropertyValueSet.fromString("pp_a=1;b=2;pp_c=3");
      const resultingPvs = PropertyValueSet.map(
        kvp =>
          kvp.key.startsWith("pp_") ? { ...kvp, key: kvp.key.substr(3) } : kvp,
        pvs1
      );
      const pvs2 = PropertyValueSet.fromString("a=1;b=2;c=3");
      assert.isTrue(PropertyValueSet.equals(resultingPvs, pvs2));
    });
    it("it should map based on value", () => {
      const pvs1 = PropertyValueSet.fromString(
        "a=10:Celsius;b=20:Watt;c=30:Celsius;d=4"
      );
      const resultingPvs = PropertyValueSet.map(
        kvp => ({
          ...kvp,
          value: PropertyValue.fromInteger(
            kvp.value.type === "amount" &&
            kvp.value.value.unit.quantity === "Temperature"
              ? 1
              : 0
          )
        }),
        pvs1
      );
      const pvs2 = PropertyValueSet.fromString("a=1;b=0;c=1;d=0");
      assert.isTrue(PropertyValueSet.equals(resultingPvs, pvs2));
    });
  });
});

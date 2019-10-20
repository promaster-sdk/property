import { Units, Amount } from "uom";
import * as PropertyValueSet from "../property-value-set";
import * as PropertyValue from "../property-value";

describe("PropertyValueSet", () => {
  describe("getValue", () => {
    it("should get text value", () => {
      const pvs = PropertyValueSet.fromString('message="MyMessage"');
      expect(PropertyValueSet.getValue("message", pvs)).toEqual(
        PropertyValue.fromText("MyMessage")
      );
    });

    it("should get integer value", () => {
      const pvs = PropertyValueSet.fromString("message=12");
      expect(PropertyValueSet.getValue("message", pvs)).toEqual(
        PropertyValue.fromInteger(12)
      );
    });

    it("should get amount value", () => {
      const pvs = PropertyValueSet.fromString("message=12:Celsius");
      expect(PropertyValueSet.getValue("message", pvs)).toEqual(
        PropertyValue.fromAmount(Amount.create(12, Units.Celsius, 0))
      );
    });

    it("should_get_default_if_type_is_not_matching", () => {
      const pvs = PropertyValueSet.fromString("a=10:Celsius");
      const pv2 = PropertyValueSet.getInteger("a", pvs);
      expect(pv2).toBe(undefined);
    });
  });

  describe("parsing", () => {
    it("should parse a=1", () => {
      const pvs = PropertyValueSet.fromString("a=1");
      expect(PropertyValueSet.get("a", pvs)).toEqual(
        PropertyValue.fromInteger(1)
      );
    });

    it("should parse a=1;b=2;", () => {
      const pvs = PropertyValueSet.fromString("a=1;b=2;");
      expect(PropertyValueSet.get("a", pvs)).toEqual(
        PropertyValue.fromInteger(1)
      );
      expect(PropertyValueSet.get("b", pvs)).toEqual(
        PropertyValue.fromInteger(2)
      );
    });
  });

  describe("set", () => {
    it("should set the specified property", () => {
      const pvs = PropertyValueSet.fromString("a=1;b=2;c=3");
      const pvs2 = PropertyValueSet.set("b", PropertyValue.fromInteger(5), pvs);
      expect(PropertyValueSet.get("a", pvs2)).toEqual(
        PropertyValue.fromInteger(1)
      );
      expect(PropertyValueSet.get("b", pvs2)).toEqual(
        PropertyValue.fromInteger(5)
      );
      expect(PropertyValueSet.get("c", pvs2)).toEqual(
        PropertyValue.fromInteger(3)
      );
    });
  });

  describe("setInteger", () => {
    it("should set the specified property", () => {
      const pvs = PropertyValueSet.fromString("a=1;b=2;c=3");
      const pvs2 = PropertyValueSet.setInteger("b", 5, pvs);
      expect(PropertyValueSet.get("a", pvs2)).toEqual(
        PropertyValue.fromInteger(1)
      );
      expect(PropertyValueSet.get("b", pvs2)).toEqual(
        PropertyValue.fromInteger(5)
      );
      expect(PropertyValueSet.get("c", pvs2)).toEqual(
        PropertyValue.fromInteger(3)
      );
    });
  });

  describe("setAmount", () => {
    it("should set the specified property", () => {
      const pvs = PropertyValueSet.fromString("a=1;b=2;c=3");
      const pvs2 = PropertyValueSet.setAmount(
        "b",
        Amount.create(12, Units.Celsius),
        pvs
      );
      expect(PropertyValueSet.getInteger("a", pvs2)).toBe(1);
      const a1 = PropertyValueSet.getAmount("b", pvs2);
      expect(a1).not.toBe(undefined);
      expect(Amount.equals(a1!, Amount.create(12, Units.Celsius))).toBe(true);
      expect(PropertyValueSet.getInteger("c", pvs2)).toBe(3);
    });
  });

  describe("equals", () => {
    it("should see two sets with same keys and values as equal regardless of order", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      const pvs2 = PropertyValueSet.fromString("c=3;b=2;a=1");
      expect(PropertyValueSet.equals(pvs1, pvs2)).toBe(true);
    });

    it("should see two sets with same keys but different values as unequal", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      const pvs2 = PropertyValueSet.fromString("a=1;b=2;c=4");
      expect(PropertyValueSet.equals(pvs1, pvs2)).toBe(false);
    });

    it("should see two sets with differnet keys as unequal", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      const pvs2 = PropertyValueSet.fromString("a=1;b=2");
      expect(PropertyValueSet.equals(pvs1, pvs2)).toBe(false);
    });
  });

  describe("toString", () => {
    it("toString should result in a valid set, equal to the original", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;b=2;c=3");
      const str1 = PropertyValueSet.toString(pvs1);
      const pvs2 = PropertyValueSet.fromString(str1);
      expect(PropertyValueSet.equals(pvs1, pvs2)).toBe(true);
    });

    it("toString should remove properties with null or undefined value", () => {
      const pvs1 = {
        a: PropertyValue.fromInteger(1),
        b: PropertyValue.fromInteger(2),
        c: null,
        d: undefined
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      const str1 = PropertyValueSet.toString(pvs1);
      expect("a=1;b=2").toBe(str1);
    });
  });

  describe("isEmpty", () => {
    it("it should return true on empty object", () => {
      const pvs1 = PropertyValueSet.fromString("");
      expect(PropertyValueSet.isEmpty(pvs1)).toBe(true);
    });

    it("it should return true on undefined", () => {
      expect(PropertyValueSet.isEmpty(undefined)).toBe(true);
    });

    it("it should return true on null", () => {
      expect(PropertyValueSet.isEmpty(null)).toBe(true);
    });

    it("it should return false on non empty object", () => {
      const pvs1 = PropertyValueSet.fromString("a=1");
      expect(PropertyValueSet.isEmpty(pvs1)).toBe(false);
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
      expect("a=1;c=3").toBe(resultingPvsString);
    });
    it("it should not add any properties", () => {
      const pvs1 = PropertyValueSet.fromString("a=1;c=3");
      const propertyNamesToKeep: Array<string> = ["a", "b", "c"];
      const resultingPvs = PropertyValueSet.keepProperties(
        propertyNamesToKeep,
        pvs1
      );
      const resultingPvsString = PropertyValueSet.toString(resultingPvs);
      expect("a=1;c=3").toBe(resultingPvsString);
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
      expect(PropertyValueSet.equals(resultingPvs, pvs2)).toBe(true);
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
      expect(PropertyValueSet.equals(resultingPvs, pvs2)).toBe(true);
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
      expect(PropertyValueSet.equals(resultingPvs, pvs2)).toBe(true);
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
      expect(PropertyValueSet.equals(resultingPvs, pvs2)).toBe(true);
    });
  });
});

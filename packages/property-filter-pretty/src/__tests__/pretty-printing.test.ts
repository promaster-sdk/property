import { UnitFormat, BaseUnits, Unit } from "uom";
import { PropertyFilter } from "@promaster-sdk/property";
import * as PrettyPrinting from "../index";

const unitsFormat = {
  Meter: UnitFormat.createUnitFormat("m", 2),
};

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

describe("filterPrettyPrintSimple", () => {
  it("should print a must be 1", () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(
      PropertyFilter.fromString("a=1", unitLookup) as PropertyFilter.PropertyFilter
    );
    expect(pretty).toBe("a must be 1");
  });

  it("should print a must be 1 and b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(
      PropertyFilter.fromString("a=1&b=2", unitLookup) as PropertyFilter.PropertyFilter
    );
    expect(pretty).toBe("a must be 1 and b must be 2");
  });

  it("should print a + b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(
      PropertyFilter.fromString("a+b=2", unitLookup) as PropertyFilter.PropertyFilter
    );
    expect(pretty).toBe("a + b must be 2");
  });

  it("should print a - b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(
      PropertyFilter.fromString("a-b=2", unitLookup) as PropertyFilter.PropertyFilter
    );
    expect(pretty).toBe("a - b must be 2");
  });

  it("should print a * b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(
      PropertyFilter.fromString("a*b=2", unitLookup) as PropertyFilter.PropertyFilter
    );
    expect(pretty).toBe("a * b must be 2");
  });

  it("should print a / b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(
      PropertyFilter.fromString("a/b=2", unitLookup) as PropertyFilter.PropertyFilter
    );
    expect(pretty).toBe("a / b must be 2");
  });

  it("should print a must be -2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintSimple(
      PropertyFilter.fromString("a=-2", unitLookup) as PropertyFilter.PropertyFilter
    );
    expect(pretty).toBe("a must be -2");
  });
});

describe("filterPrettyPrintIndented", () => {
  // const messages = PrettyPrinting.FilterPrettyPrintMessagesEnglish;
  const messages = PrettyPrinting.buildEnglishMessages(unitsFormat);

  it("should print a must be 1", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "*",
      PropertyFilter.fromString("a=1", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("a must be a_1");
  });

  it("should for min<max print min must be less than max", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "*",
      PropertyFilter.fromString("min<max", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("min must be less than max");
  });

  it("should for min<10:Meter print min must be less than 10 m", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "*",
      PropertyFilter.fromString("min<10:Meter", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("min must be less than 10 m");
  });

  it("should print b must be 2\\n**and\\na must be 1", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "**",
      PropertyFilter.fromString("a=1&b=2", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("a must be a_1\n**and\nb must be b_2");
  });

  it("should print a + b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "**",
      PropertyFilter.fromString("a+b=2", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("a + b must be 2");
  });

  it("should print a - b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "**",
      PropertyFilter.fromString("a-b=2", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("a - b must be 2");
  });

  it("should print a * b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "**",
      PropertyFilter.fromString("a*b=2", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("a * b must be 2");
  });

  it("should print a / b must be 2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "**",
      PropertyFilter.fromString("a/b=2", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("a / b must be 2");
  });

  it("should print a must be -2", () => {
    const pretty = PrettyPrinting.filterPrettyPrintIndented(
      messages,
      0,
      "**",
      PropertyFilter.fromString("a=-2", unitLookup) as PropertyFilter.PropertyFilter,
      unitsFormat,
      unitLookup
    );
    expect(pretty).toBe("a must be -2");
  });
});

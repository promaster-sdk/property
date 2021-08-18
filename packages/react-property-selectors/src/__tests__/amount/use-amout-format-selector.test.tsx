import { useAmountFormatSelector } from "../../amount";
import { units } from "../../__stories__/units-map";

describe("Test UseAmountFormatSelector Hook", () => {
  it("should do smthn", () => {
    //  const units = {
    //     Meter: BaseUnits.Meter,
    //     CentiMeter: UnitPrefix.Centi("CentiMeter", BaseUnits.Meter),
    //     Millimeter: UnitPrefix.Milli("Millimeter", BaseUnits.Meter),
    //   };

    // const unitsFormat: UnitFormat.UnitFormatMap = {
    //     Meter: UnitFormat.createUnitFormat("m", 2),
    //     CentiMeter: UnitFormat.createUnitFormat("cm", 2),
    //     Millimeter: UnitFormat.createUnitFormat("mm", 2),
    //   };

    //   const selectableFormats: ReadonlyArray<SelectableFormat> = [
    //     { unit: units.Meter, decimalCount: 1 },
    //     { unit: units.Meter, decimalCount: 2 },
    //     { unit: units.Meter, decimalCount: 3 },
    //     { unit: units.CentiMeter, decimalCount: 1 },
    //     { unit: units.CentiMeter, decimalCount: 2 },
    //     { unit: units.Millimeter, decimalCount: 1 },
    //   ];

    const hook = useAmountFormatSelector({
      getSelectableFormats: () => ({ head: [], current: { unit: units.Meter, decimalCount: 2 }, tail: [] }),
      onFormatChanged: () => {
        // hej
      },
      unitLabels: {},
      onFormatCleared: () => {
        // hej
      },
    });

    expect(hook.unitItems.length).toBe(1);
  });
});

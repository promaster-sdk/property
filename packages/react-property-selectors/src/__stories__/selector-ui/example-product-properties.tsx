import { PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { BaseUnits, UnitMap } from "uom";
import { SelectableFormat } from "../..";
import { units } from "../units-map";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

export type SelectorTypes = { readonly [propertyName: string]: string };

export type MyPropertyValueDef = {
  readonly sortNo: number;
  readonly image?: string;
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly text: string;
};

export type MyPropertyDef = MyAmountPropertyDef | MyDiscretePropertyDef;

export type MyPropertyDefBase = {
  readonly sortNo: number;
  readonly name: string;
  readonly group: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly visibilityFilter: PropertyFilter.PropertyFilter;
  readonly items: ReadonlyArray<MyPropertyValueDef>;
};

export type MyAmountPropertyDef = MyPropertyDefBase & {
  readonly type: "Amount";
  readonly selectableFormats: ReadonlyArray<SelectableFormat>;
};

export type MyDiscretePropertyDef = MyPropertyDefBase & {
  readonly type: "Discrete";
  readonly selectorType?: "Checkbox" | "RadioGroup";
};

export function exampleProductProperties(): {
  readonly properties: ReadonlyArray<MyPropertyDef>;
} {
  return {
    properties: [
      {
        type: "Amount",
        sortNo: 1,
        name: "a",
        group: "",
        validationFilter: PropertyFilter.fromString("a>100:Meter", unitLookup) || PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [],
        selectableFormats: [
          { unit: units.Meter, decimalCount: 1 },
          { unit: units.Meter, decimalCount: 2 },
          { unit: units.Meter, decimalCount: 3 },
          { unit: units.CentiMeter, decimalCount: 1 },
          { unit: units.CentiMeter, decimalCount: 2 },
          { unit: units.Millimeter, decimalCount: 1 },
        ],
      },
      {
        type: "Discrete",
        sortNo: 2,
        name: "b",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 10,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.Empty,
            text: "b_1",
            image: "http://vignette4.wikia.nocookie.net/mrmen/images/5/52/Small.gif/revision/latest?cb=20100731114437",
          },
          {
            sortNo: 20,
            value: PropertyValue.fromInteger(2),
            validationFilter: PropertyFilter.Empty,
            text: "b_2",
          },
        ],
      },
      {
        type: "Discrete",
        sortNo: 3,
        name: "c",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 10,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.fromString("b=1", unitLookup) || PropertyFilter.Empty,
            text: "c_1",
          },
          {
            sortNo: 20,
            value: PropertyValue.fromInteger(2),
            validationFilter: PropertyFilter.Empty,
            text: "c_2",
          },
          {
            sortNo: 30,
            value: PropertyValue.fromInteger(3),
            validationFilter: PropertyFilter.Empty,
            text: "c_3",
          },
        ],
      },
      {
        type: "Discrete",
        sortNo: 4,
        selectorType: "RadioGroup",
        name: "d",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 10,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.fromString("c=1", unitLookup) || PropertyFilter.Empty,
            text: "d_1",
          },
          {
            sortNo: 20,
            value: PropertyValue.fromInteger(2),
            validationFilter: PropertyFilter.Empty,
            text: "d_2",
          },
          {
            sortNo: 30,
            value: PropertyValue.fromInteger(3),
            validationFilter: PropertyFilter.Empty,
            text: "d_3",
          },
        ],
      },
      {
        type: "Discrete",
        sortNo: 5,
        selectorType: "Checkbox",
        name: "e",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 0,
            value: PropertyValue.fromInteger(0),
            validationFilter: PropertyFilter.Empty,
            text: "e_0",
          },
          {
            sortNo: 1,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.Empty,
            text: "e_1",
            image: "https://s7d1.scene7.com/is/image/BedBathandBeyond/13136517105892p?$478$",
          },
        ],
      },
    ],
  };
}

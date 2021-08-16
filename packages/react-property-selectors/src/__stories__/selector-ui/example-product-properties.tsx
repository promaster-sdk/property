import { PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { BaseUnits, UnitMap } from "uom";
import { SelectableUnit } from "../..";
import { units } from "../units-map";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

export type SelectorTypes = { readonly [propertyName: string]: string };

export type MyItem = {
  readonly sortNo: number;
  readonly image?: string;
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly text: string;
};

export type MyPropertyInfo = {
  readonly selectorType?: "Checkbox" | "RadioGroup";
  readonly sortNo: number;
  readonly name: string;
  readonly group: string;
  readonly quantity: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly visibilityFilter: PropertyFilter.PropertyFilter;
  readonly items: ReadonlyArray<MyItem>;
  readonly selectableUnits: ReadonlyArray<SelectableUnit>;
};

export function exampleProductProperties(): {
  // selectorTypes: SelectorTypes;
  readonly properties: ReadonlyArray<MyPropertyInfo>;
} {
  return {
    // selectorTypes: {
    //   d: "RadioGroup",
    //   e: "Checkbox",
    // },
    properties: [
      {
        sortNo: 1,
        name: "a",
        group: "",
        quantity: "Length",
        validationFilter: PropertyFilter.fromString("a>100:Meter", unitLookup) || PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [],
        selectableUnits: [
          { unit: units.Meter, label: "m", selectableDecimalCounts: [1, 2] },
          { unit: units.CentiMeter, label: "cm", selectableDecimalCounts: [2, 3] },
          { unit: units.Millimeter, label: "mm", selectableDecimalCounts: [3, 4] },
        ],
      },
      {
        sortNo: 2,
        name: "b",
        group: "Group1",
        quantity: "Discrete",
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
        selectableUnits: [],
      },
      {
        sortNo: 3,
        name: "c",
        group: "Group1",
        quantity: "Discrete",
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
        selectableUnits: [],
      },
      {
        sortNo: 4,
        selectorType: "RadioGroup",
        name: "d",
        group: "Group1",
        quantity: "Discrete",
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
        selectableUnits: [],
      },
      {
        sortNo: 5,
        selectorType: "Checkbox",
        name: "e",
        group: "Group1",
        quantity: "Discrete",
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
        selectableUnits: [],
      },
    ],
  };
}

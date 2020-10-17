import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { BaseUnits, Unit } from "uom";

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

export type SelectorTypes = { readonly [propertyName: string]: string };

export function exampleProductProperties(): {
  selectorTypes: SelectorTypes;
  properties: ReadonlyArray<PropertiesSelector.UsePropertiesSelectorProperty>;
} {
  return {
    selectorTypes: {
      d: "RadioGroup",
      e: "Checkbox",
    },
    properties: [
      {
        sortNo: 1,
        name: "a",
        group: "",
        quantity: "Length",
        validationFilter: PropertyFilter.fromString("a>100:Meter", unitLookup) || PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        valueItems: [],
      },
      {
        sortNo: 2,
        name: "b",
        group: "Group1",
        quantity: "Discrete",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        valueItems: [
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
        sortNo: 3,
        name: "c",
        group: "Group1",
        quantity: "Discrete",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        valueItems: [
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
        sortNo: 4,
        // selectorType: "RadioGroup",
        name: "d",
        group: "Group1",
        quantity: "Discrete",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        valueItems: [
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
        sortNo: 5,
        // selectorType: "Checkbox",
        name: "e",
        group: "Group1",
        quantity: "Discrete",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        valueItems: [
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

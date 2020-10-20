import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { BaseUnits, UnitMap } from "uom";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

export function exampleProductProperties(): ReadonlyArray<PropertiesSelector.Property> {
  return [
    {
      sort_no: 1,
      name: "a",
      group: "",
      quantity: "Length",
      validation_filter: PropertyFilter.fromString("a>100:Meter", unitLookup) || PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: [],
    },
    {
      sort_no: 2,
      name: "b",
      group: "Group1",
      quantity: "Discrete",
      validation_filter: PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: [
        {
          sort_no: 10,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.Empty,
          image: "http://vignette4.wikia.nocookie.net/mrmen/images/5/52/Small.gif/revision/latest?cb=20100731114437",
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty,
        },
      ],
    },
    {
      sort_no: 3,
      name: "c",
      group: "Group1",
      quantity: "Discrete",
      validation_filter: PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: [
        {
          sort_no: 10,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.fromString("b=1", unitLookup) || PropertyFilter.Empty,
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty,
        },
        {
          sort_no: 30,
          value: PropertyValue.fromInteger(3),
          property_filter: PropertyFilter.Empty,
        },
      ],
    },
    {
      sort_no: 4,
      selector_type: "RadioGroup",
      name: "d",
      group: "Group1",
      quantity: "Discrete",
      validation_filter: PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: [
        {
          sort_no: 10,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.fromString("c=1", unitLookup) || PropertyFilter.Empty,
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty,
        },
        {
          sort_no: 30,
          value: PropertyValue.fromInteger(3),
          property_filter: PropertyFilter.Empty,
        },
      ],
    },
    {
      sort_no: 5,
      selector_type: "Checkbox",
      name: "e",
      group: "Group1",
      quantity: "Discrete",
      validation_filter: PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: [
        {
          sort_no: 0,
          value: PropertyValue.fromInteger(0),
          property_filter: PropertyFilter.Empty,
        },
        {
          sort_no: 1,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.Empty,
          image: "https://s7d1.scene7.com/is/image/BedBathandBeyond/13136517105892p?$478$",
        },
      ],
    },
  ];
}

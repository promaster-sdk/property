import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyFilter, PropertyValue } from "@promaster-sdk/property";
import { BaseUnits, Unit } from "uom";

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

export function exampleProductProperties(): Array<PropertiesSelector.UsePropertiesSelectorProperty> {
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
          sortNo: 10,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.Empty,
        },
        {
          sortNo: 20,
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
          sortNo: 10,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.fromString("b=1", unitLookup) || PropertyFilter.Empty,
        },
        {
          sortNo: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty,
        },
        {
          sortNo: 30,
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
          sortNo: 10,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.fromString("c=1", unitLookup) || PropertyFilter.Empty,
        },
        {
          sortNo: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty,
        },
        {
          sortNo: 30,
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
          sortNo: 0,
          value: PropertyValue.fromInteger(0),
          property_filter: PropertyFilter.Empty,
        },
        {
          sortNo: 1,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.Empty,
          image: "https://s7d1.scene7.com/is/image/BedBathandBeyond/13136517105892p?$478$",
        },
      ],
    },
  ];
}

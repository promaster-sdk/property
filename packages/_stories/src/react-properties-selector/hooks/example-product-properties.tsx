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
          validationFilter: PropertyFilter.Empty,
          text: "1",
        },
        {
          sortNo: 20,
          value: PropertyValue.fromInteger(2),
          validationFilter: PropertyFilter.Empty,
          text: "2",
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
          validationFilter: PropertyFilter.fromString("b=1", unitLookup) || PropertyFilter.Empty,
          text: "1",
        },
        {
          sortNo: 20,
          value: PropertyValue.fromInteger(2),
          validationFilter: PropertyFilter.Empty,
          text: "2",
        },
        {
          sortNo: 30,
          value: PropertyValue.fromInteger(3),
          validationFilter: PropertyFilter.Empty,
          text: "3",
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
          validationFilter: PropertyFilter.fromString("c=1", unitLookup) || PropertyFilter.Empty,
          text: "1",
        },
        {
          sortNo: 20,
          value: PropertyValue.fromInteger(2),
          validationFilter: PropertyFilter.Empty,
          text: "2",
        },
        {
          sortNo: 30,
          value: PropertyValue.fromInteger(3),
          validationFilter: PropertyFilter.Empty,
          text: "3",
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
          validationFilter: PropertyFilter.Empty,
          text: "0",
        },
        {
          sortNo: 1,
          value: PropertyValue.fromInteger(1),
          validationFilter: PropertyFilter.Empty,
          text: "1",
          image: "https://s7d1.scene7.com/is/image/BedBathandBeyond/13136517105892p?$478$",
        },
      ],
    },
  ];
}

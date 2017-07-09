import {PropertiesSelector} from "@promaster/promaster-react";
import {PropertyFilter, PropertyValue} from "@promaster/promaster-primitives";

export function exampleProductProperties(): Array<PropertiesSelector.Property> {
  return [
    {
      sort_no: 1,
      name: "a",
      group: "",
      quantity: "Temperature",
      validation_filter: PropertyFilter.fromString("a>100:Celsius") || PropertyFilter.Empty,
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
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty,
        }
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
          property_filter: PropertyFilter.fromString("b=1") || PropertyFilter.Empty,
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
        }
      ],
    }
  ];
}
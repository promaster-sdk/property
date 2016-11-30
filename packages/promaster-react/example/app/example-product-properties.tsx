import {PropertiesSelector} from "@promaster/promaster-react";
import {PropertyFilter, PropertyValue} from "@promaster/promaster-primitives";

export function exampleProductProperties(): Array<PropertiesSelector.Property> {
  return [
    {
      sortNo: 1,
      name: "a",
      group: "Group1",
      quantity: "Temperature",
      validationFilter: PropertyFilter.fromString("a>100:Celsius") || PropertyFilter.Empty,
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
          value: PropertyValue.fromInteger(1),
          sortNo: 10,
          validationFilter: PropertyFilter.Empty,
        },
        {
          value: PropertyValue.fromInteger(2),
          sortNo: 20,
          validationFilter: PropertyFilter.Empty,
        }
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
          value: PropertyValue.fromInteger(1),
          sortNo: 10,
          validationFilter: PropertyFilter.fromString("b=1") || PropertyFilter.Empty,
        },
        {
          value: PropertyValue.fromInteger(2),
          sortNo: 20,
          validationFilter: PropertyFilter.Empty,
        },
        {
          value: PropertyValue.fromInteger(3),
          sortNo: 30,
          validationFilter: PropertyFilter.Empty,
        }
      ],
    }
  ];
}

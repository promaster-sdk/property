import React from "react";
import * as renderer from "react-test-renderer";
import {
  PropertyFilter,
  PropertyValue,
  PropertyValueSet
} from "@promaster-sdk/property";
import * as PropertiesSelector from "../index";

test("Simple PropertiesSelector", () => {
  const productProperties = exampleProductProperties();
  const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
    productProperties: productProperties,
    selectedProperties: PropertyValueSet.Empty
  };

  const component = renderer.create(
    <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  // tree.props.onMouseEnter();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();

  // // manually trigger the callback
  // tree.props.onMouseLeave();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
});

export function exampleProductProperties(): Array<PropertiesSelector.Property> {
  return [
    {
      sort_no: 1,
      name: "a",
      group: "",
      quantity: "Temperature",
      validation_filter:
        PropertyFilter.fromString("a>100:Celsius") || PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: []
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
          property_filter: PropertyFilter.Empty
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty
        }
      ]
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
          property_filter:
            PropertyFilter.fromString("b=1") || PropertyFilter.Empty
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty
        },
        {
          sort_no: 30,
          value: PropertyValue.fromInteger(3),
          property_filter: PropertyFilter.Empty
        }
      ]
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
          property_filter:
            PropertyFilter.fromString("c=1") || PropertyFilter.Empty
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(2),
          property_filter: PropertyFilter.Empty
        },
        {
          sort_no: 30,
          value: PropertyValue.fromInteger(3),
          property_filter: PropertyFilter.Empty
        }
      ]
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
          property_filter: PropertyFilter.Empty
        },
        {
          sort_no: 1,
          value: PropertyValue.fromInteger(1),
          property_filter: PropertyFilter.Empty,
          image:
            "https://s7d1.scene7.com/is/image/BedBathandBeyond/13136517105892p?$478$"
        }
      ]
    }
  ];
}

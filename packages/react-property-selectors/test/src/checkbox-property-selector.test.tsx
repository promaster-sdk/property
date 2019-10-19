import React from "react";
import * as renderer from "react-test-renderer";
import {
  PropertyValueSet,
  PropertyValue,
  PropertyFilter
} from "@promaster-sdk/property";
import {
  createCheckboxPropertySelector,
  CheckboxPropertyValueItem
} from "@promaster-sdk/react-property-selectors";

const CheckboxPropertySelector = createCheckboxPropertySelector({});

test("Simple CheckboxPropertySelector", () => {
  const valueItems1: Array<CheckboxPropertyValueItem> = [
    {
      value: PropertyValue.create("integer", 0),
      sortNo: 1,
      text: "unchecked",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter
    },
    {
      value: PropertyValue.create("integer", 1),
      sortNo: 2,
      text: "checked",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter
    }
  ];
  const component = renderer.create(
    <CheckboxPropertySelector
      propertyName="a"
      valueItems={valueItems1}
      propertyValueSet={PropertyValueSet.Empty}
      locked={false}
      showCodes={true}
      filterPrettyPrint={() => ""}
      readOnly={false}
      onValueChange={() => ""}
    />
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

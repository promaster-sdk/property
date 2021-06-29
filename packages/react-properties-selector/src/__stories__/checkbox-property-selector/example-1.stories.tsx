/* eslint-disable functional/no-this-expression */
import React, { useState } from "react";
import { Meta } from "@storybook/react";
import { BaseUnits, UnitMap } from "uom";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { createCheckboxPropertySelector, CheckboxPropertyValueItem } from "../../checkbox";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

const CheckboxPropertySelector = createCheckboxPropertySelector({});

export function Example1(): JSX.Element {
  const [myState, setMyState] = useState(PropertyValueSet.fromString("a=1", unitLookup));
  const valueItems1: ReadonlyArray<CheckboxPropertyValueItem> = [
    {
      value: PropertyValue.create("integer", 0),
      sortNo: 1,
      text: "unchecked",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter,
    },
    {
      value: PropertyValue.create("integer", 1),
      sortNo: 2,
      text: "checked",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter,
    },
  ];

  return (
    <div>
      <div>CheckboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <CheckboxPropertySelector
          propertyName="a"
          valueItems={valueItems1}
          propertyValueSet={myState}
          locked={false}
          showCodes={true}
          onValueChange={(pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState))}
          filterPrettyPrint={() => ""}
          readOnly={false}
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "COMP/Checkbox Property Selector",
} as Meta;

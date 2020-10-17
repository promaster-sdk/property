import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import { CheckboxPropertyValueItem, useDiscretePropertySelector } from "@promaster-sdk/react-property-selectors";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { MyDiscreteCheckboxSelector } from "../../../hooks-selector-ui/selector-ui";

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

export function CheckboxPropertySelectorExample1Hooks(): JSX.Element {
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

  const selA = useDiscretePropertySelector({
    propertyName: "a",
    valueItems: valueItems1,
    propertyValueSet: myState,
    onValueChange: (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),
    showCodes: true,
  });

  return (
    <div>
      <div>CheckboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <MyDiscreteCheckboxSelector {...selA} />
      </div>
    </div>
  );
}

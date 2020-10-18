import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import { CheckboxPropertyValueItem, useDiscretePropertySelector } from "@promaster-sdk/react-property-selectors";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { MyDiscreteCheckboxSelector } from "../selector-ui/selector-ui";

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

  const undefinedValueItem = {
    value: undefined,
    sortNo: -1,
    text: "",
    validationFilter: PropertyFilter.Empty,
  };
  const selA = useDiscretePropertySelector({
    propertyName: "a",
    valueItems: valueItems1,
    propertyValueSet: myState,
    onValueChange: (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),
    getUndefinedValueItem: () => undefinedValueItem,
    showCodes: true,
    getItemValue: (item) => item.value,
    getItemFilter: (item) => item.validationFilter,
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

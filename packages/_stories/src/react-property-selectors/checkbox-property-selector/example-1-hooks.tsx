/* eslint-disable functional/no-this-expression */
import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import {
  CheckboxPropertyValueItem,
  getDefaultCheckboxContainerStyle,
  getDefaultCheckboxStyle,
  useCheckboxPropertySelector
} from "@promaster-sdk/react-property-selectors";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";

const unitLookup: Unit.UnitLookup = unitString =>
  (BaseUnits as Unit.UnitMap)[unitString];

export function CheckboxPropertySelectorExample1Hooks(): JSX.Element {
  const [myState, setMyState] = useState(
    PropertyValueSet.fromString("a=1", unitLookup)
  );

  const valueItems1: ReadonlyArray<CheckboxPropertyValueItem> = [
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

  const selA = useCheckboxPropertySelector({
    propertyName: "a",
    valueItems: valueItems1,
    propertyValueSet: myState,
    locked: false,
    showCodes: true,
    onValueChange: pv =>
      setMyState(
        PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)
      ),

    filterPrettyPrint: () => "",
    readOnly: false
  });

  return (
    <div>
      <div>CheckboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <div
          {...selA.getContainerDivProps()}
          style={getDefaultCheckboxContainerStyle()}
        >
          {selA.image && <img src={selA.image} />}
          <div>{selA.label}</div>
          <div
            {...selA.getCheckboxDivProps()}
            style={getDefaultCheckboxStyle(selA)}
          />
        </div>
      </div>
    </div>
  );
}

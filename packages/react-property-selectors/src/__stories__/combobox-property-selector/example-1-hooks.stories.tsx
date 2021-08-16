/* eslint-disable functional/no-this-expression */
import React, { useState } from "react";
import { Meta } from "@storybook/react";
import { UnitMap } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { useDiscretePropertySelector } from "../../discrete";
import { unitsFormat, units } from "../units-map";
import { MyDiscreteComboboxSelector, MyDiscreteImageComboboxSelector } from "../selector-ui/selector-ui";
import { MyPropertyValueDef } from "../selector-ui/example-product-properties";

const unitLookup: UnitMap.UnitLookup = (unitString) => (units as UnitMap.UnitMap)[unitString];

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.buildEnglishMessages(unitsFormat),
    2,
    " ",
    propertyFilter,
    unitsFormat,
    unitLookup
  );

export function Example1(): JSX.Element {
  const [myState, setMyState] = useState(PropertyValueSet.fromString("a=1;b=2", unitLookup));

  const valueItems1: ReadonlyArray<MyPropertyValueDef> = [
    {
      value: PropertyValue.create("integer", 1),
      sortNo: 1,
      text: "Alternative 1",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter,
    },
    {
      value: PropertyValue.create("integer", 2),
      sortNo: 2,
      text: "Alternative 2",
      validationFilter: PropertyFilter.fromString("b=2", unitLookup) as PropertyFilter.PropertyFilter,
    },
  ];

  const valueItems2: ReadonlyArray<MyPropertyValueDef> = [
    {
      value: PropertyValue.create("integer", 1),
      sortNo: 1,
      text: "Alternative 1",
      image: "http://vignette4.wikia.nocookie.net/mrmen/images/5/52/Small.gif/revision/latest?cb=20100731114437",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter,
    },
    {
      value: PropertyValue.create("integer", 2),
      sortNo: 2,
      text: "Alternative 2",
      validationFilter: PropertyFilter.fromString("a=2", unitLookup) as PropertyFilter.PropertyFilter,
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
    items: valueItems1,
    propertyValueSet: myState,
    onValueChange: (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),
    getUndefinedValueItem: () => undefinedValueItem,
    showCodes: true,
    sortValidFirst: true,
    filterPrettyPrint: filterPrettyPrint,
    getItemValue: (item) => item.value,
    getItemFilter: (item) => item.validationFilter,
  });

  const selB = useDiscretePropertySelector({
    propertyName: "b",
    items: valueItems2,
    propertyValueSet: myState,
    showCodes: true,
    sortValidFirst: true,
    onValueChange: (pv) => setMyState(PropertyValueSet.set("b", pv as PropertyValue.PropertyValue, myState)),
    getUndefinedValueItem: () => undefinedValueItem,
    filterPrettyPrint: filterPrettyPrint,
    getItemValue: (item) => item.value,
    getItemFilter: (item) => item.validationFilter,
  });

  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <MyDiscreteComboboxSelector {...selA} />
        <MyDiscreteImageComboboxSelector {...selB} />
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "HOOKS/Combobox Property Selector",
} as Meta;

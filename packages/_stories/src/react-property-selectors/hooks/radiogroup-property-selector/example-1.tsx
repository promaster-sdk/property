import React, { useState } from "react";
import { Unit } from "uom";
import { createRadioGroupPropertySelector, RadioGroupPropertyValueItem } from "@promaster-sdk/react-property-selectors";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { unitsFormat, units } from "../../units-map";

const unitLookup: Unit.UnitLookup = (unitString) => (units as Unit.UnitMap)[unitString];

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.buildEnglishMessages(unitsFormat),
    2,
    " ",
    propertyFilter,
    unitsFormat,
    unitLookup
  );

const RadioGroupPropertySelector = createRadioGroupPropertySelector({});

export function RadioGroupPropertySelectorExample1(): JSX.Element {
  const [state, setState] = useState(PropertyValueSet.fromString("a=1;b=2", unitLookup));
  const valueItems1: Array<RadioGroupPropertyValueItem> = [
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

  const valueItems2: Array<RadioGroupPropertyValueItem> = [
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

  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(state)}</div>
      <div>
        <RadioGroupPropertySelector
          propertyName="a"
          valueItems={valueItems1}
          propertyValueSet={state}
          locked={false}
          showCodes={true}
          onValueChange={(pv) => setState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, state))}
          filterPrettyPrint={filterPrettyPrint}
          readOnly={false}
        />
        <RadioGroupPropertySelector
          propertyName="b"
          valueItems={valueItems2}
          propertyValueSet={state}
          locked={false}
          showCodes={true}
          onValueChange={(pv) => setState(PropertyValueSet.set("b", pv as PropertyValue.PropertyValue, state))}
          filterPrettyPrint={filterPrettyPrint}
          readOnly={false}
        />
      </div>
    </div>
  );
}

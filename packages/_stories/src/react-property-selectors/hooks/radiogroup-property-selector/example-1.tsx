import React, { useState } from "react";
import { Unit } from "uom";
import {
  createRadioGroupPropertySelector,
  RadioGroupItemInfo,
  RadioGroupPropertyValueItem,
  useRadioGroupPropertySelector,
} from "@promaster-sdk/react-property-selectors";
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

  const selA = useRadioGroupPropertySelector({
    propertyName: "a",
    valueItems: valueItems1,
    propertyValueSet: state,
    locked: false,
    showCodes: true,
    onValueChange: (pv) => setState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, state)),
    filterPrettyPrint: filterPrettyPrint,
    readOnly: false,
  });

  const selB = useRadioGroupPropertySelector({
    propertyName: "b",
    valueItems: valueItems2,
    propertyValueSet: state,
    locked: false,
    showCodes: true,
    onValueChange: (pv) => setState(PropertyValueSet.set("b", pv as PropertyValue.PropertyValue, state)),
    filterPrettyPrint: filterPrettyPrint,
    readOnly: false,
  });

  console.log(selB);

  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(state)}</div>
      <div>
        <div id="RadioGroup" {...selA.getGroupProps()}>
          {selA.items.map((item) => (
            // <RadioGroupItem {...item} />
            <div
              id="RadioGroupItem"
              {...item.getItemProps()}
              // onClick={onClick}
              title={item.toolTip}
              style={getDefaultRadioItemStyle(item)}
            >
              {item.imageUrl ? <img src={item.imageUrl} /> : undefined}
              {item.label}
            </div>
          ))}
        </div>

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

function getDefaultRadioItemStyle(item: RadioGroupItemInfo): {} {
  return {
    cursor: item.isItemValid ? "pointer" : "not-allowed",
    display: "inline-block",
    marginRight: "10px",
    padding: "10px",
    border: item.selected ? "2px solid " + (item.isItemValid ? "#39f" : "red") : "2px solid transparent",
    color: item.isItemValid ? "black" : "grey",
    // ${(p: RadioGroupItemProps) =>
    //   p.isItemValid ? "&:hover { background: #39f; color: white;" : ""}
  };
}

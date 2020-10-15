/* eslint-disable functional/no-this-expression */
import React, { useState } from "react";
import { Unit } from "uom";
import {
  ComboBoxPropertyValueItem,
  useComboboxPropertySelector,
  useImageComboboxPropertySelector,
  getDefaultSelectStyle,
  getDefaultOptionStyle,
  getDefaultMenuStyle,
  getDefaultListItemStyle,
  getDefaultToggleButtonStyle,
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

export function ComboboxPropertySelectorExample1Hooks(): JSX.Element {
  const [myState, setMyState] = useState(PropertyValueSet.fromString("a=1;b=2", unitLookup));

  const valueItems1: Array<ComboBoxPropertyValueItem> = [
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

  const valueItems2: Array<ComboBoxPropertyValueItem> = [
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

  const selA = useComboboxPropertySelector({
    propertyName: "a",
    valueItems: valueItems1,
    propertyValueSet: myState,
    locked: false,
    showCodes: true,
    sortValidFirst: true,

    onValueChange: (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),

    filterPrettyPrint: filterPrettyPrint,
    readOnly: false,
  });

  const selB = useImageComboboxPropertySelector({
    propertyName: "b",
    valueItems: valueItems2,
    propertyValueSet: myState,
    locked: false,
    showCodes: true,
    sortValidFirst: true,
    onValueChange: (pv) => setMyState(PropertyValueSet.set("b", pv as PropertyValue.PropertyValue, myState)),

    filterPrettyPrint: filterPrettyPrint,
    readOnly: false,
  });

  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        {/* Selector A */}
        <select {...selA.getSelectProps()} style={{ ...getDefaultSelectStyle(selA) }}>
          {selA.options.map((o) => (
            <option {...o.getOptionProps()} style={getDefaultOptionStyle(o)} />
          ))}
        </select>

        {/* Selector B Image */}
        <div style={{ userSelect: "none" }}>
          <button {...selB.getToggleButtonProps()} style={getDefaultToggleButtonStyle(selB)}>
            <span>
              {selB.imageUrl && <img src={selB.imageUrl} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
              {" " + selB.label + " "}
            </span>
            <i className="fa fa-caret-down" />
          </button>
          {/* optionsList */}
          {selB.isOpen && (
            <ul id="DropdownOptionsElement" style={getDefaultMenuStyle()}>
              {selB.items.map((o) => (
                <li {...o.getItemProps()} style={getDefaultListItemStyle(o)}>
                  <span>
                    {o.imageUrl && <img src={o.imageUrl} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
                    {" " + o.label + " "}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

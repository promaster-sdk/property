/* eslint-disable functional/no-this-expression */
import React, { useState } from "react";
import { Unit } from "uom";
import {
  ComboBoxPropertyValueItem,
  useComboboxPropertySelector,
  useImageComboboxPropertySelector,
  getDefaultSelectStyle,
  getDefaultOptionStyle
} from "@promaster-sdk/react-property-selectors";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";
import { unitsFormat, units } from "../units-map";

const unitLookup: Unit.UnitLookup = unitString =>
  (units as Unit.UnitMap)[unitString];

const filterPrettyPrint = (
  propertyFilter: PropertyFilter.PropertyFilter
): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.buildEnglishMessages(unitsFormat),
    2,
    " ",
    propertyFilter,
    unitsFormat,
    unitLookup
  );

export function ComboboxPropertySelectorExample1Hooks(): JSX.Element {
  const [myState, setMyState] = useState(
    PropertyValueSet.fromString("a=1;b=2", unitLookup)
  );

  const valueItems1: Array<ComboBoxPropertyValueItem> = [
    {
      value: PropertyValue.create("integer", 1),
      sortNo: 1,
      text: "Alternative 1",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter
    },
    {
      value: PropertyValue.create("integer", 2),
      sortNo: 2,
      text: "Alternative 2",
      validationFilter: PropertyFilter.fromString(
        "b=2",
        unitLookup
      ) as PropertyFilter.PropertyFilter
    }
  ];

  const valueItems2: Array<ComboBoxPropertyValueItem> = [
    {
      value: PropertyValue.create("integer", 1),
      sortNo: 1,
      text: "Alternative 1",
      image:
        "http://vignette4.wikia.nocookie.net/mrmen/images/5/52/Small.gif/revision/latest?cb=20100731114437",
      validationFilter: PropertyFilter.Empty as PropertyFilter.PropertyFilter
    },
    {
      value: PropertyValue.create("integer", 2),
      sortNo: 2,
      text: "Alternative 2",
      validationFilter: PropertyFilter.fromString(
        "a=2",
        unitLookup
      ) as PropertyFilter.PropertyFilter
    }
  ];

  const selA = useComboboxPropertySelector({
    propertyName: "a",
    valueItems: valueItems1,
    propertyValueSet: myState,
    locked: false,
    showCodes: true,
    sortValidFirst: true,

    onValueChange: pv =>
      setMyState(
        PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)
      ),

    filterPrettyPrint: filterPrettyPrint,
    readOnly: false
  });

  const selB = useComboboxPropertySelector({
    propertyName: "b",
    valueItems: valueItems2,
    propertyValueSet: myState,
    locked: false,
    showCodes: true,
    sortValidFirst: true,
    onValueChange: pv =>
      setMyState(
        PropertyValueSet.set("b", pv as PropertyValue.PropertyValue, myState)
      ),

    filterPrettyPrint: filterPrettyPrint,
    readOnly: false
  });

  const selC = useImageComboboxPropertySelector({
    propertyName: "b",
    valueItems: valueItems2,
    propertyValueSet: myState,
    locked: false,
    showCodes: true,
    sortValidFirst: true,
    onValueChange: pv =>
      setMyState(
        PropertyValueSet.set("b", pv as PropertyValue.PropertyValue, myState)
      ),

    filterPrettyPrint: filterPrettyPrint,
    readOnly: false
  });

  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        {/* Selector A */}
        <select
          {...selA.getSelectProps()}
          style={{ ...getDefaultSelectStyle(selA) }}
        >
          {selA.options.map(o => (
            <option {...o.getOptionProps()} style={getDefaultOptionStyle(o)} />
          ))}
        </select>

        {/* Selector B */}
        <select
          {...selB.getSelectProps()}
          style={{ ...getDefaultSelectStyle(selB) }}
        >
          {selA.options.map(o => (
            <option {...o.getOptionProps()} style={getDefaultOptionStyle(o)} />
          ))}
        </select>

        {/* Selector C Image */}
        <div style={{ userSelect: "none" }}>
          {selC.isOpen ? (
            <div
              id="background"
              onClick={() => selC.setIsOpen(false)}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              }}
            />
          ) : (
            undefined
          )}
          <div
            id="ComboBoxImageButtonElement"
            title={
              selC.selected !== undefined ? selC.selected.tooltip : undefined
            }
            onClick={() => selC.setIsOpen(!selC.isOpen)}
            style={{
              width: "162px",
              alignItems: "center",
              background: "white",
              color: "black",
              height: "30px",
              whiteSpace: "nowrap",
              border: "1px solid #b4b4b4",
              borderRadius: "3px",
              font:
                "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
              outline: "rgb(131, 131, 131) none 0px",
              padding: "1px 5px 0px 14px",
              textAlign: "right",

              ...buttonElementStyles({
                isSelectedItemValid: selC.isSelectedItemValid,
                locked: selC.locked
              })
            }}
          >
            {renderImageListItem(selC.selected)}
            <i className="fa fa-caret-down" />
          </div>
          {/* optionsList */}
          {selC.isOpen ? (
            <ul
              id="DropdownOptionsElement"
              style={{
                position: "absolute",
                display: "block",
                background: "white",
                border: "1px solid #bbb",
                listStyle: "none",
                margin: 0,
                padding: 0,
                zIndex: 100
              }}
            >
              {selC.options.map(o => {
                return (
                  <li {...o.getItemProps()} style={getDefaultListItemStyle(o)}>
                    {renderImageListItem(o)}
                  </li>
                );
              })}
            </ul>
          ) : (
            undefined
          )}
        </div>
      </div>
    </div>
  );
}

function getDefaultListItemStyle(o: { readonly isItemValid: boolean }): {} {
  return {
    color: o.isItemValid === false ? "color: red" : "rgb(131, 131, 131)",
    minHeight: "18px",
    alignSelf: "center",
    border: "0px none rgb(131, 131, 131)",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "0.2em 0.5em",
    cursor: "default"
  };
}

function buttonElementStyles({
  isSelectedItemValid,
  locked
}: {
  readonly isSelectedItemValid?: boolean;
  readonly locked: boolean;
}): {} {
  if (isSelectedItemValid === false && locked) {
    return {
      background: "lightgray",
      color: "red",
      border: "none"
    };
  } else if (isSelectedItemValid === false) {
    return { color: "red" };
  } else if (locked) {
    return {
      background: "lightgray",
      color: "darkgray",
      border: "none"
    };
  }

  return {};
}

function renderImageListItem(
  item:
    | {
        readonly label: string;
        readonly imageUrl?: string;
      }
    | undefined
): React.ReactElement<{}> {
  console.log("_renderItem imageUrl", item && item.imageUrl);
  return item ? (
    <span>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          style={{
            maxWidth: "2em",
            maxHeight: "2em"
          }}
        />
      ) : (
        <span />
      )}
      {" " + item.label + " "}
    </span>
  ) : (
    <span />
  );
}

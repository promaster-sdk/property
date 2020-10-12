/* eslint-disable functional/no-this-expression */
import React from "react";
import { Unit } from "uom";
import {
  createComboboxPropertySelector,
  ComboBoxPropertyValueItem,
  useComboboxPropertySelector,
  UseComboboxPropertySelector
} from "@promaster-sdk/react-property-selectors";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";
import { merge } from "../utils";
import { unitsFormat, units } from "../units-map";

const unitLookup: Unit.UnitLookup = unitString =>
  (units as Unit.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
}

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

const ComboboxPropertySelector = createComboboxPropertySelector({});

// eslint-disable-next-line functional/no-class
export class ComboboxPropertySelectorExample1Hooks extends React.Component<
  {},
  State
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=1;b=2", unitLookup)
    };
  }

  render(): JSX.Element {
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
      propertyValueSet: this.state.propertyValueSet,
      locked: false,
      showCodes: true,
      sortValidFirst: true,
      onValueChange: pv =>
        this.setState(
          merge(this.state, {
            propertyValueSet: PropertyValueSet.set(
              "a",
              pv as PropertyValue.PropertyValue,
              this.state.propertyValueSet
            )
          })
        ),
      filterPrettyPrint: filterPrettyPrint,
      readOnly: false
    });

    const selB = useComboboxPropertySelector({
      propertyName: "b",
      valueItems: valueItems2,
      propertyValueSet: this.state.propertyValueSet,
      locked: false,
      showCodes: true,
      sortValidFirst: true,
      onValueChange: pv =>
        this.setState(
          merge(this.state, {
            propertyValueSet: PropertyValueSet.set(
              "b",
              pv as PropertyValue.PropertyValue,
              this.state.propertyValueSet
            )
          })
        ),

      filterPrettyPrint: filterPrettyPrint,
      readOnly: false
    });

    console.log("selA", selA);

    return (
      <div>
        <div>ComboboxPropertySelector:</div>
        <div>
          PropertyValueSet:{" "}
          {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <select
            {...selA.getSelectProps()}
            style={{ ...standardSelectStyles(selA) }}
          >
            {selA.options.map(o => (
              <option
                {...o.getOptionProps()}
                style={{
                  color: o.isItemValid ? "rgb(131, 131, 131)" : "red",
                  minHeight: "18px",
                  alignSelf: "center",
                  border: "0px none rgb(131, 131, 131)",
                  font:
                    "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
                  outline: "rgb(131, 131, 131) none 0px"
                }}
              />
            ))}
          </select>
          <select
            {...selB.getSelectProps()}
            style={{ ...standardSelectStyles(selB) }}
          >
            {selA.options.map(o => (
              <option
                {...o.getOptionProps()}
                style={{
                  color: o.isItemValid ? "rgb(131, 131, 131)" : "red",
                  minHeight: "18px",
                  alignSelf: "center",
                  border: "0px none rgb(131, 131, 131)",
                  font:
                    "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
                  outline: "rgb(131, 131, 131) none 0px"
                }}
              />
            ))}
          </select>
          <ComboboxPropertySelector
            propertyName="b"
            valueItems={valueItems2}
            propertyValueSet={this.state.propertyValueSet}
            locked={false}
            showCodes={true}
            sortValidFirst={true}
            onValueChange={pv =>
              this.setState(
                merge(this.state, {
                  propertyValueSet: PropertyValueSet.set(
                    "b",
                    pv as PropertyValue.PropertyValue,
                    this.state.propertyValueSet
                  )
                })
              )
            }
            filterPrettyPrint={filterPrettyPrint}
            readOnly={false}
          />
        </div>
      </div>
    );
  }
}

function standardSelectStyles(o: UseComboboxPropertySelector): {} {
  const always = {
    color: "black",
    height: "30px",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 30px 0px 10px"
  };

  if (!o.isSelectedItemValid && o.locked) {
    return {
      ...always,
      background: "lightgray",
      color: "red",
      border: "none"
    };
  } else if (!o.isSelectedItemValid) {
    return { ...always, color: "red" };
  } else if (o.locked) {
    return {
      ...always,
      background: "lightgray",
      color: "darkgray",
      border: "none"
    };
  }
  return { ...always };
}

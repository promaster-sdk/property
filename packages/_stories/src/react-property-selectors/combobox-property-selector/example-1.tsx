/* eslint-disable functional/no-this-expression */
import React from "react";
import {
  createComboboxPropertySelector,
  ComboBoxPropertyValueItem
} from "@promaster-sdk/react-property-selectors";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";
import { merge } from "../utils";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
}

const filterPrettyPrint = (
  propertyFilter: PropertyFilter.PropertyFilter
): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish,
    2,
    " ",
    propertyFilter
  );

const ComboboxPropertySelector = createComboboxPropertySelector({});

// eslint-disable-next-line functional/no-class
export class ComboboxPropertySelectorExample1 extends React.Component<
  {},
  State
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=1;b=2")
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
          "b=2"
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
          "a=2"
        ) as PropertyFilter.PropertyFilter
      }
    ];

    return (
      <div>
        <div>ComboboxPropertySelector:</div>
        <div>
          PropertyValueSet:{" "}
          {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <ComboboxPropertySelector
            propertyName="a"
            valueItems={valueItems1}
            propertyValueSet={this.state.propertyValueSet}
            locked={false}
            showCodes={true}
            sortValidFirst={true}
            onValueChange={pv =>
              this.setState(
                merge(this.state, {
                  propertyValueSet: PropertyValueSet.set(
                    "a",
                    pv as PropertyValue.PropertyValue,
                    this.state.propertyValueSet
                  )
                })
              )
            }
            filterPrettyPrint={filterPrettyPrint}
            readOnly={false}
          />
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

/* eslint-disable functional/no-this-expression */
import React from "react";
import { Meta } from "@storybook/react";
import { UnitMap } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { createRadioGroupPropertySelector, RadioGroupPropertyValueItem } from "../../radio-group";
import { merge } from "../utils";
import { unitsFormat, units } from "../units-map";

const unitLookup: UnitMap.UnitLookup = (unitString) => (units as UnitMap.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
}

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

// eslint-disable-next-line functional/no-class
class RadioGroupPropertySelectorExample1 extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=1;b=2", unitLookup),
    };
  }

  render(): JSX.Element {
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
        <div>PropertyValueSet: {PropertyValueSet.toString(this.state.propertyValueSet)}</div>
        <div>
          <RadioGroupPropertySelector
            propertyName="a"
            valueItems={valueItems1}
            propertyValueSet={this.state.propertyValueSet}
            locked={false}
            showCodes={true}
            onValueChange={(pv) =>
              this.setState(
                merge(this.state, {
                  propertyValueSet: PropertyValueSet.set(
                    "a",
                    pv as PropertyValue.PropertyValue,
                    this.state.propertyValueSet
                  ),
                })
              )
            }
            filterPrettyPrint={filterPrettyPrint}
            readOnly={false}
          />
          <RadioGroupPropertySelector
            propertyName="b"
            valueItems={valueItems2}
            propertyValueSet={this.state.propertyValueSet}
            locked={false}
            showCodes={true}
            onValueChange={(pv) =>
              this.setState(
                merge(this.state, {
                  propertyValueSet: PropertyValueSet.set(
                    "b",
                    pv as PropertyValue.PropertyValue,
                    this.state.propertyValueSet
                  ),
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

export const Example1 = (): JSX.Element => <RadioGroupPropertySelectorExample1 />;

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "COMP/Radiogroup Property Selector",
} as Meta;

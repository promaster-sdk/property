import * as React from "react";
import {
  createCheckboxPropertySelector,
  CheckboxPropertyValueItem
} from "@promaster-sdk/react-property-selectors";

import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";
import { merge } from "../utils";

// tslint:disable:variable-name no-class no-this no-any

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
}

const CheckboxPropertySelector = createCheckboxPropertySelector({});

export class CheckboxPropertySelectorExample1 extends React.Component<
  {},
  State
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=1")
    };
  }

  render(): JSX.Element {
    const valueItems1: Array<CheckboxPropertyValueItem> = [
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

    return (
      <div>
        <div>CheckboxPropertySelector:</div>
        <div>
          PropertyValueSet:{" "}
          {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <CheckboxPropertySelector
            propertyName="a"
            valueItems={valueItems1}
            propertyValueSet={this.state.propertyValueSet}
            locked={false}
            showCodes={true}
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
            filterPrettyPrint={() => ""}
            readOnly={false}
          />
        </div>
      </div>
    );
  }
}

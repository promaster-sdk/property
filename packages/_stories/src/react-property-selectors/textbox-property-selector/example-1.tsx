/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { BaseUnits } from "uom";
import { createTextboxPropertySelector } from "@promaster-sdk/react-property-selectors";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { merge } from "../utils";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
}

const TextboxPropertySelector = createTextboxPropertySelector({});

export class TextboxPropertySelectorExample1 extends React.Component<
  {},
  State
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString(
        'a="This is the value";b=3',
        BaseUnits
      )
    };
  }

  render(): React.ReactElement<{}> {
    return (
      <div>
        <div>ComboboxPropertySelector:</div>
        <div>
          PropertyValueSet:{" "}
          {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <TextboxPropertySelector
            propertyName="a"
            propertyValueSet={this.state.propertyValueSet}
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
            readOnly={false}
            debounceTime={600}
          />
        </div>
      </div>
    );
  }
}

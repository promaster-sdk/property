import * as React from "react";
import { createTextboxPropertySelector } from "../../src/textbox/textbox-property-selector";
import { PropertyValueSet, PropertyValue } from "@promaster/property";
import { merge } from "../utils";

// tslint:disable:variable-name no-class no-this no-any

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
      propertyValueSet: PropertyValueSet.fromString('a="This is the value";b=3')
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

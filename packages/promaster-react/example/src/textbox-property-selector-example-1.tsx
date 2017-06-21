import * as React from "react";
import { PropertySelectors as Selectors } from "@promaster/promaster-react";
import { PropertyValueSet, PropertyValue } from "@promaster/promaster-primitives";
import { merge } from "./utils";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
}

const TextboxPropertySelector = Selectors.createTextboxPropertySelector({});

export class TextboxPropertySelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a='This is the value';b=3"),
    };
  }

  render() {

    return (
      <div>
        <div>
          ComboboxPropertySelector:
        </div>
        <div>
          PropertyValueSet: {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <TextboxPropertySelector
            value={PropertyValueSet.getText("a", this.state.propertyValueSet) as string}
            onValueChange={(pv) =>
              this.setState(merge(this.state, {
                propertyValueSet: PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, this.state.propertyValueSet)
              }))}
            readOnly={false}
            debounceTime={600} />
        </div>
      </div>
    );

  }
}


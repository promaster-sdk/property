import * as React from "react";
import { PropertiesSelector } from "@promaster/promaster-react";
import { PropertyValueSet } from "@promaster/promaster-primitives";
import { exampleProductProperties } from "./example-product-properties";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
}

export class PropertiesSelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Celsius;b=1;"),
    };
  }

  render() {

    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      productProperties: productProperties,
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) => {
        this.setState({ ...this.state, propertyValueSet: properties });
        console.log("updated");
      },
    };

    return (
      <div>
        <p>This example shows minimal configuration, using as much defaults as possible</p>
        <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
      </div>
    );

  }
}


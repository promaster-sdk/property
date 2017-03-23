import * as React from "react";
import * as R from "ramda";
import { PropertiesSelector } from "@promaster/promaster-react";
import { Unit, PropertyValueSet } from "@promaster/promaster-primitives";
import { merge } from "./utils";
import { exampleProductProperties } from "./example-product-properties";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
  readonly closedGroups: Array<string>,
  readonly propertyFormats: { [key: string]: PropertiesSelector.AmountFormat },
}

export class PropertiesSelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Celsius;b=1;"),
      closedGroups: [],
      propertyFormats: {},
    };
  }

  render() {

    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      productProperties: productProperties,
      selectedProperties: this.state.propertyValueSet,
      includeCodes: true,
      onChange: (properties: PropertyValueSet.PropertyValueSet) => {
        this.setState(merge(this.state, { propertyValueSet: properties }))
        console.log("updated");
      },
      onPropertyFormatChanged: (propertyName: string, unit: Unit.Unit<any>, decimalCount: number) =>
        this.setState(merge(this.state, {
          propertyFormats: merge(this.state.propertyFormats, {
            [propertyName]: { unit, decimalCount }
          })
        })),
      onPropertyFormatCleared: (propertyName: string) =>
        this.setState(merge(this.state, {
          propertyFormats: R.dissoc(propertyName, this.state.propertyFormats)
        })),
    };

    return (
      <div>
        <p>This example shows minimal configuration, using as much defaults as possible</p>
        <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
      </div>
    );

  }
}


/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import React from "react";
import { Meta } from "@storybook/react";
import { BaseUnits, UnitMap } from "uom";
import { PropertyValueSet } from "@promaster-sdk/property";
import { action } from "@storybook/addon-actions";
import * as PropertiesSelector from "../../properties-selector";
import { exampleProductProperties } from "./example-product-properties";
import { units, unitsFormat } from "./units-map";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
}

class PropertiesSelectorExample1 extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Meter;b=1;", unitLookup),
    };
  }

  render(): React.ReactElement<{}> {
    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      units,
      unitsFormat,
      unitLookup,
      productProperties: productProperties,
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet, _changedProperties: ReadonlyArray<string>) => {
        this.setState({ ...this.state, propertyValueSet: properties });
        // console.log("updated: ", changedProperties);
      },
      onPropertyFormatSelectorToggled: action("toggle property format selector"),
    };

    return (
      <div>
        <p>This example shows minimal configuration, using as much defaults as possible</p>
        <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
      </div>
    );
  }
}

export const Example1 = (): JSX.Element => <PropertiesSelectorExample1 />;

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "COMP/Properties Selector",
} as Meta;

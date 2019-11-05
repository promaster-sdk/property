/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import React from "react";
import * as R from "ramda";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { Unit } from "uom";
import { PropertyFilter, PropertyValueSet } from "@promaster-sdk/property";
import { merge } from "./utils";
import { exampleProductProperties } from "./example-product-properties";
import { createPropertiesSelectorExample2Layout } from "./example-2-layout";
import { units, unitsFormat } from "./units-map";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly closedGroups: ReadonlyArray<string>;
  readonly propertyFormats: {
    readonly [key: string]: PropertiesSelector.AmountFormat;
  };
}

const filterPrettyPrint = (
  propertyFilter: PropertyFilter.PropertyFilter
): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.buildEnglishMessages(unitsFormat),
    2,
    " ",
    propertyFilter,
    unitsFormat
  );

export class PropertiesSelectorExample2 extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Meter;b=1;"),
      closedGroups: [],
      propertyFormats: {}
    };
  }

  render(): React.ReactElement<{}> {
    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      units,
      unitsFormat,
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) => {
        // console.log("onChange", properties);
        this.setState(merge(this.state, { propertyValueSet: properties }));
      },
      productProperties: productProperties,
      includeCodes: true,
      includeHiddenProperties: true,
      filterPrettyPrint: filterPrettyPrint,
      propertyFormats: this.state.propertyFormats,
      readOnlyProperties: [],
      optionalProperties: ["a"],
      onPropertyFormatChanged: (
        propertyName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        unit: Unit.Unit<any>,
        decimalCount: number
      ) =>
        this.setState(
          merge(this.state, {
            propertyFormats: merge(this.state.propertyFormats, {
              [propertyName]: { unit, decimalCount }
            })
          })
        ),
      onPropertyFormatCleared: (propertyName: string) =>
        this.setState(
          merge(this.state, {
            propertyFormats: R.dissoc(propertyName, this.state.propertyFormats)
          })
        ),
      autoSelectSingleValidValue: true,
      translatePropertyName: (propertyName: string) =>
        `${propertyName}_Translation`,
      translatePropertyValue: (
        propertyName: string,
        value: number | undefined
      ) => `${propertyName}_${value}_Translation`,
      translateValueMustBeNumericMessage: () => "value_must_be_numeric",
      translateValueIsRequiredMessage: () => "value_is_required",
      translatePropertyLabelHover: () => "translatePropertyLabelHover",
      translateGroupName: () => "translateGroupName",
      closedGroups: [],
      onToggleGroupClosed: () => "",
      LayoutRenderer: createPropertiesSelectorExample2Layout()
    };

    return (
      <div>
        <span>{PropertyValueSet.toString(this.state.propertyValueSet)}</span>
        <div style={{ margin: 20 }}>
          This example shows how the whole layout can be overridden
        </div>
        <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
      </div>
    );
  }
}

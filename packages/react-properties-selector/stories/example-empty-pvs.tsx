import * as React from "react";
import * as R from "ramda";
import * as PropertiesSelector from "../src/index";
import * as PropertyFiltering from "@promaster/property-filter-tools";
import { Unit } from "uom";
import { PropertyFilter, PropertyValueSet } from "@promaster/property";
import { merge } from "./utils";
import { exampleProductProperties } from "./example-product-properties";

// tslint:disable:variable-name no-class no-this no-any

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly closedGroups: Array<string>;
  readonly propertyFormats: {
    readonly [key: string]: PropertiesSelector.AmountFormat;
  };
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish,
    2,
    " ",
    propertyFilter
  );

export class PropertiesSelectorExampleEmptyPvs extends React.Component<
  {},
  State
> {
  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString(""),
      closedGroups: [],
      propertyFormats: {}
    };
  }

  render(): React.ReactElement<{}> {
    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) => {
        this.setState(merge(this.state, { propertyValueSet: properties }));
        // console.log("updated");
      },
      productProperties: productProperties,
      includeCodes: true,
      includeHiddenProperties: true,
      filterPrettyPrint: filterPrettyPrint,
      propertyFormats: this.state.propertyFormats,
      readOnlyProperties: [],
      optionalProperties: [],
      onPropertyFormatChanged: (
        propertyName: string,
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
      inputDebounceTime: 600
    };

    return (
      <div>
        <div>{PropertyValueSet.toString(this.state.propertyValueSet)}</div>
        <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
      </div>
    );
  }
}

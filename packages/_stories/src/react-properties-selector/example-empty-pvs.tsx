/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import * as React from "react";
import * as R from "ramda";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { Unit } from "uom";
import { PropertyFilter, PropertyValueSet } from "@promaster-sdk/property";
import { merge } from "./utils";
import { exampleProductProperties } from "./example-product-properties";

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
    PropertyFiltering.FilterPrettyPrintMessagesEnglish,
    2,
    " ",
    propertyFilter
  );

export class PropertiesSelectorExampleEmptyPvs extends React.Component<
  {},
  State
> {
  constructor(props: {}) {
    super(props);
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

/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import * as React from "react";
import * as R from "ramda";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { Unit } from "uom";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";
import { merge } from "./utils";

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

export class PropertiesSelectorExample4LockSingleValidValue extends React.Component<
  {},
  State
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=20;b=200;"),
      closedGroups: [],
      propertyFormats: {}
    };
  }

  render(): React.ReactElement<{}> {
    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      selectedProperties: this.state.propertyValueSet,
      onChange: (
        properties: PropertyValueSet.PropertyValueSet,
        _changedProps: ReadonlyArray<string>
      ) => {
        this.setState(merge(this.state, { propertyValueSet: properties }));
      },
      productProperties: productProperties,
      includeCodes: true,
      includeHiddenProperties: true,
      filterPrettyPrint: filterPrettyPrint,
      propertyFormats: this.state.propertyFormats,
      readOnlyProperties: [],
      optionalProperties: [],
      lockSingleValidValue: true,
      autoSelectSingleValidValue: false,
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
        <h2>single valid value</h2>
        <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
      </div>
    );
  }
}

export function exampleProductProperties(): Array<PropertiesSelector.Property> {
  return [
    {
      sort_no: 1,
      name: "a",
      group: "Group1",
      quantity: "Discrete",
      validation_filter: PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: [
        {
          sort_no: 10,
          value: PropertyValue.fromInteger(10),
          property_filter: PropertyFilter.Empty
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(20),
          property_filter: PropertyFilter.fromStringOrEmpty("")
        }
      ]
    },
    {
      sort_no: 1,
      name: "b",
      group: "Group1",
      quantity: "Discrete",
      validation_filter: PropertyFilter.Empty,
      visibility_filter: PropertyFilter.Empty,
      value: [
        {
          sort_no: 100,
          value: PropertyValue.fromInteger(100),
          property_filter: PropertyFilter.Empty
        },
        {
          sort_no: 200,
          value: PropertyValue.fromInteger(200),
          property_filter: PropertyFilter.fromStringOrEmpty("a!=20")
        }
      ]
    }
  ];
}

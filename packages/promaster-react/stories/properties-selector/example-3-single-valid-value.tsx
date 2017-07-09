import * as React from "react";
import * as R from "ramda";
import { PropertiesSelector } from "@promaster/promaster-react";
import { PropertyFiltering } from "@promaster/promaster-portable";
import { Unit, PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster/promaster-primitives";
import { merge } from "../utils";

// tslint:disable:variable-name no-class no-this no-any

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
  readonly closedGroups: Array<string>,
  readonly propertyFormats: { [key: string]: PropertiesSelector.AmountFormat },
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish, 2, " ", propertyFilter);

export class PropertiesSelectorExample3SingleValidValue extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=20;b=200;"),
      closedGroups: [],
      propertyFormats: {},
    };
  }

  render(): React.ReactElement<{}> {

    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) => {
        this.setState(merge(this.state, { propertyValueSet: properties }))
        // console.log("updated");
      },
      productProperties: productProperties,
      includeCodes: true,
      includeHiddenProperties: true,
      filterPrettyPrint: filterPrettyPrint,
      propertyFormats: this.state.propertyFormats,
      readOnlyProperties: [],
      optionalProperties: [],
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
      autoSelectSingleValidValue: true,
      translatePropertyName: (propertyName: string) => `${propertyName}_Translation`,
      translatePropertyValue: (propertyName: string, value: number | undefined) => `${propertyName}_${value}_Translation`,
      translateValueMustBeNumericMessage: () => "value_must_be_numeric",
      translateValueIsRequiredMessage: () => "value_is_required",
      translatePropertyLabelHover: () => "translatePropertyLabelHover",
      translateGroupName: () => "translateGroupName",
      closedGroups: [],
      onToggleGroupClosed: () => "",
      inputDebounceTime: 600
    };

    return <div>
      <h2>single valid value</h2>
      <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
    </div>;

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
          property_filter: PropertyFilter.Empty,
        },
        {
          sort_no: 20,
          value: PropertyValue.fromInteger(20),
          property_filter: PropertyFilter.fromStringOrEmpty(""),
        }
      ],
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
          property_filter: PropertyFilter.Empty,
        },
        {
          sort_no: 200,
          value: PropertyValue.fromInteger(200),
          property_filter: PropertyFilter.fromStringOrEmpty("a!=20"),
        }
      ],
    }
  ];
}

import * as React from "react";
import {PropertiesSelector} from "@promaster/promaster-react";
import {PropertyFiltering} from "@promaster/promaster-portable";
import {Unit, PropertyFilter, PropertyValueSet, PropertyValue} from "@promaster/promaster-primitives";
import {merge} from "./utils";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
  readonly closedGroups: Array<string>,
  readonly propertyFormats: {[key: string]: PropertiesSelector.AmountFormat},
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish, 2, " ", propertyFilter);

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

    const styles: PropertiesSelector.RenderPropertySelectorsParametersStyles = {};
    const productProperties = buildProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) => {
        //console.log("onChange", properties);
        this.setState(merge(this.state, {propertyValueSet: properties}))
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
            [propertyName]: {unit, decimalCount}
          })
        })),
      autoSelectSingleValidValue: true,
      translatePropertyName: (propertyName: string) => `${propertyName}_Translation`,
      translatePropertyValue: (propertyName: string, value: number | undefined) => `${propertyName}_${value}_Translation`,
      translateValueMustBeNumericMessage: () => "value_must_be_numeric",
      translateValueIsRequiredMessage: () => "value_is_required",
      translatePropertyLabelHover: () => "translatePropertyLabelHover",
      translateGroupName: () => "translateGroupName",
      styles: styles
    };

    return <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />

  }
}

function buildProductProperties(): Array<PropertiesSelector.Property> {
  return [
    {
      sortNo: 1,
      name: "a",
      group: "Group1",
      quantity: "Temperature",
      validationFilter: PropertyFilter.fromString("a>100:Celsius") || PropertyFilter.Empty,
      visibilityFilter: PropertyFilter.Empty,
      valueItems: [],
    },
    {
      sortNo: 2,
      name: "b",
      group: "Group1",
      quantity: "Discrete",
      validationFilter: PropertyFilter.Empty,
      visibilityFilter: PropertyFilter.Empty,
      valueItems: [
        {
          value: PropertyValue.fromInteger(1),
          sortNo: 10,
          validationFilter: PropertyFilter.Empty,
        },
        {
          value: PropertyValue.fromInteger(2),
          sortNo: 20,
          validationFilter: PropertyFilter.Empty,
        }
      ],
    },
    {
      sortNo: 3,
      name: "c",
      group: "Group1",
      quantity: "Discrete",
      validationFilter: PropertyFilter.Empty,
      visibilityFilter: PropertyFilter.Empty,
      valueItems: [
        {
          value: PropertyValue.fromInteger(1),
          sortNo: 10,
          validationFilter: PropertyFilter.fromString("b=1") || PropertyFilter.Empty,
        },
        {
          value: PropertyValue.fromInteger(2),
          sortNo: 20,
          validationFilter: PropertyFilter.Empty,
        },
        {
          value: PropertyValue.fromInteger(3),
          sortNo: 30,
          validationFilter: PropertyFilter.Empty,
        }
      ],
    }
  ];
}
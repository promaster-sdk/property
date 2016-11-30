import * as React from "react";
import {PropertiesSelector} from "@promaster/promaster-react";
import {PropertyFiltering} from "@promaster/promaster-portable";
import {Unit, PropertyFilter, PropertyValueSet} from "@promaster/promaster-primitives";
import {merge} from "./utils";
import {exampleProductProperties} from "./example-product-properties";
import {PropertiesSelectorExample2Layout} from "./properties-selector-example-2-layout";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
  readonly closedGroups: Array<string>,
  readonly propertyFormats: {[key: string]: PropertiesSelector.AmountFormat},
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish, 2, " ", propertyFilter);

export class PropertiesSelectorExample2 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Celsius;b=1;"),
      closedGroups: [],
      propertyFormats: {},
    };
  }

  render() {

    const styles: PropertiesSelector.PropertySelectorStyles = {};
    const productProperties = exampleProductProperties();
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
      styles: styles,
      closedGroups: [],
      onToggleGroupClosed: () => "",
      LayoutComponent: PropertiesSelectorExample2Layout
    };

    return (
      <div>
        <div style={{margin: 20}}>This example shows how the whole layout can be overridden</div>
        <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
      </div>
    );

  }
}

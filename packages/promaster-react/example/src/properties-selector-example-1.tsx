import * as React from "react";
import * as R from "ramda";
import {PropertiesSelector} from "@promaster/promaster-react";
import {PropertyFiltering} from "@promaster/promaster-portable";
import {Unit, PropertyFilter, PropertyValueSet} from "@promaster/promaster-primitives";
import {merge} from "./utils";
import {exampleProductProperties} from "./example-product-properties";

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

    const styles: PropertiesSelector.PropertySelectorStyles = {};
    const productProperties = exampleProductProperties();
    const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) => {
        this.setState(merge(this.state, {propertyValueSet: properties}))
        console.log("updated");
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
      styles: styles,
      closedGroups: [],
      onToggleGroupClosed: () => "",
      inputDebounceTime: 600
    };

    return <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />

  }
}


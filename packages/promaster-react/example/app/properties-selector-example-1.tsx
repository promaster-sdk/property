import * as React from "react";
import {PropertiesSelector} from "promaster-react";
import {PropertyFiltering} from "promaster-portable";
import {Unit, PropertyFilter, PropertyValueSet, PropertyValue} from "promaster-primitives";
import {merge} from "./utils";
import {PropertiesSelectorLayout} from "./properties-selector-example-1-layout";

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

    const classNames = {
      amountPropertySelectorClassNames: {
        amount: "amount",
        amountFormatSelectorClassNames: {
          format: "format",
          formatActive: "format active",
          unit: "unit",
          precision: "precision",
          cancel: "cancel",
        },
        amountInputBoxClassNames: {
          input: '',
          inputInvalid: "invalid",
        }
      },
      //= "property-selector" + (selectedOption.isItemValid ? "" : " invalid") + (locked ? " locked" : '');
      comboboxPropertySelectorClassNames: {
        select: "property-selector",
        selectInvalid: "property-selector invalid",
        selectLocked: "property-selector locked",
        selectInvalidLocked: "property-selector invalid locked",
        option: "",
        optionInvalid: "invalid",
      }
    };

    const productProperties: Array<PropertiesSelector.Property> = [
      {
        sortNo: 1,
        name: "a",
        group: "Group1",
        quantity: "Temperature",
        validationFilter: PropertyFilter.fromString("a>100:Celsius") as PropertyFilter.PropertyFilter,
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
      }
    ];

    // Render the selectors
    const renderPropertySelectorParams: PropertiesSelector.RenderPropertySelectorsParameters = {
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) =>
        this.setState(merge(this.state, {propertyValueSet: properties})),
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
      classNames: classNames
    };
    const renderedPropertySelectors = PropertiesSelector.renderPropertySelectors(renderPropertySelectorParams);

    // return PropertiesSelectorLayout({
    //   renderedPropertySelectors,
    //   translatePropertyLabelHover: () => "translatePropertyLabelHover",
    //   translateGroupName: (name) => `${name}_Translated`,
    //   closedGroups: this.state.closedGroups,
    //   onToggleGroupClosed: (group) => this.setState(merge(this.state, {closedGroups: group})),
    // });

    return (
      <PropertiesSelectorLayout
        renderedPropertySelectors={renderedPropertySelectors}
        translatePropertyLabelHover={ () => "translatePropertyLabelHover"}
        translateGroupName={ (name) => `${name}_Translated`}
        closedGroups={ this.state.closedGroups}
        onToggleGroupClosed={ (group) => this.setState(merge(this.state, {closedGroups: group}))}
      />
    );


  }
}


import * as React from "react";
import {PropertiesSelector} from "promaster-react";
import {PropertyFiltering} from "promaster-portable";
import {Unit, Units, PropertyFilter, PropertyValueSet} from "promaster-primitives";
import {merge} from "./utils";
import {PropertiesSelectorLayout} from "./properties_selector_layout";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
  readonly selectedUnit: Unit.Unit<any>,
  readonly selectedDecimalCount: number,
  readonly closedGroups: Array<string>,
  readonly amountFormats: {[key: string]: PropertiesSelector.AmountFormat},
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish, 2, " ", propertyFilter);

export class PropertiesSelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Celsius"),
      selectedUnit: Units.Celsius,
      selectedDecimalCount: 2,
      closedGroups: [],
      amountFormats: {},
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

    const productProperties: Array<PropertiesSelector.Property> = [];

    // Render the selectors
    const renderPropertySelectorParams: PropertiesSelector.RenderPropertySelectorsParameters = {
      selectedProperties: this.state.propertyValueSet,
      onChange: (properties: PropertyValueSet.PropertyValueSet) =>
        this.setState(merge(this.state, {propertyValueSet: properties})),
      productProperties: productProperties,
      includeCodes: true,
      includeHiddenProperties: true,
      filterPrettyPrint: filterPrettyPrint,
      inputFormats: new Map<string, PropertiesSelector.AmountFormat>(),
      readOnlyProperties: new Set<string>(),
      optionalProperties: new Set<string>(),
      onPropertyFormatChanged: (propertyName: string, unit: Unit.Unit<any>, decimalCount: number) =>
        this.setState(merge(this.state, {
          amountFormats: merge(this.state.amountFormats, {
            [propertyName]: {unit, decimalCount}
          })
        })),
      autoSelectSingleValidValue: true,
      translatePropertyName: (propertyName: string) => `${propertyName}_Translation`,
      translatePropertyValue: (propertyName: string, value: number | null) => `${propertyName}_${value}_Translation`,
      translateValueMustBeNumericMessage: () => "value_must_be_numeric",
      translateValueIsRequiredMessage: () => "value_is_required",
      classNames: classNames
    };
    const renderedPropertySelectors = PropertiesSelector.renderPropertySelectors(renderPropertySelectorParams);

    return PropertiesSelectorLayout({
      renderedPropertySelectors,
      translatePropertyLabelHover: () => "translatePropertyLabelHover",
      translateGroupName: (name) => `${name}_Translated`,
      closedGroups: this.state.closedGroups,
      onToggleGroupClosed: (group) => this.setState(merge(this.state, {closedGroups: group})),
    });

  }
}


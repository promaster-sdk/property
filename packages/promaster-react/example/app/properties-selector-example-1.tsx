import * as React from "react";
import {PropertiesSelector} from "promaster-react";
import {PropertyFiltering} from "promaster-portable";
import {Unit, Units, PropertyFilter, PropertyValueSet, PropertyValue} from "promaster-primitives";
import {merge} from "./utils";
import {PropertiesSelectorLayout} from "./properties_selector_layout";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
  readonly selectedUnit: Unit.Unit<any>,
  readonly selectedDecimalCount: number,
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish, 2, " ", propertyFilter);

const validationFilter = PropertyFilter.fromString("a<100:Celsius");

export class PropertiesSelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Celsius"),
      selectedUnit: Units.Celsius,
      selectedDecimalCount: 2,
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
      onPropertyFormatChanged: (propertyName: string, unit: Unit.Unit<any>, decimalCount: number) => 1,
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
      productId,
      intl,
      translatePropertyLabelHover: getPropertyLabelHoverText,
      hiddenTabs,
      onToggleGroupContainer,
      explicitLabels,
      calculatedProperties,
      overridableProperties,
      overriddenProperties,
      onPropertyOverrideChange,
    });

  }
}


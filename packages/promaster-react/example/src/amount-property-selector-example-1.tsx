import * as React from "react";
import {PropertySelectors} from "@promaster/promaster-react";
import {PropertyFiltering} from "@promaster/promaster-portable";
import {Unit, Units, PropertyFilter, PropertyValueSet, PropertyValue} from "@promaster/promaster-primitives";
import {merge} from "./utils";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet
  readonly selectedUnit: Unit.Unit<any>,
  readonly selectedDecimalCount: number,
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish, 2, " ", propertyFilter);

const validationFilter = PropertyFilter.fromString("a<100:Celsius") as PropertyFilter.PropertyFilter;

export class AmountPropertySelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Celsius"),
      selectedUnit: Units.Celsius,
      selectedDecimalCount: 2,
    };
  }

  render() {

    // console.log("state", this.state);

    return (
      <div>
        <div>
          AmountPropertySelector:
        </div>
        <div>
          PropertyValueSet: {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <PropertySelectors.AmountPropertySelector
            propertyName="a"
            propertyValueSet={this.state.propertyValueSet}
            inputUnit={this.state.selectedUnit}
            inputDecimalCount={this.state.selectedDecimalCount}
            onValueChange={(pv) =>
            this.setState(merge(this.state, {
              propertyValueSet: PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, this.state.propertyValueSet)
            }))}
            filterPrettyPrint={filterPrettyPrint}
            validationFilter={validationFilter}
            readOnly={false}
            isRequiredMessage="Is required"
            notNumericMessage="Not numeric"
            onFormatChanged={(selectedUnit, selectedDecimalCount) => this.setState(merge(this.state, {selectedUnit, selectedDecimalCount}))}
            onFormatCleared={() => this.setState(merge(this.state, {selectedUnit: Units.Celsius, selectedDecimalCount: 2}))}

          />
        </div>
      </div>
    );

  }
}

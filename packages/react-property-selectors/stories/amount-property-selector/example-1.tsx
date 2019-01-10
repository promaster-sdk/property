import * as React from "react";
// import { PropertySelectors } from "../../src";
import { createAmountPropertySelector } from "../../src/amount/amount-property-selector";

import * as PropertyFiltering from "@promaster/property-filter-pretty";
import { Unit, Units } from "uom";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster/property";
import { merge } from "../utils";

// tslint:disable:variable-name no-class no-this no-any

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly selectedUnit: Unit.Unit<any>;
  readonly selectedDecimalCount: number;
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter) =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.FilterPrettyPrintMessagesEnglish,
    2,
    " ",
    propertyFilter
  );

const validationFilter = PropertyFilter.fromString(
  "a<100:Celsius"
) as PropertyFilter.PropertyFilter;

const AmountPropertySelector = createAmountPropertySelector({});

export class AmountPropertySelectorExample1 extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Celsius"),
      selectedUnit: Units.Celsius,
      selectedDecimalCount: 2
    };
  }

  render(): React.ReactElement<{}> {
    // console.log("state", this.state);

    return (
      <div>
        <div>AmountPropertySelector:</div>
        <div>
          PropertyValueSet:{" "}
          {PropertyValueSet.toString(this.state.propertyValueSet)}
        </div>
        <div>
          <AmountPropertySelector
            fieldName="a"
            propertyName="a"
            propertyValueSet={this.state.propertyValueSet}
            inputUnit={this.state.selectedUnit}
            inputDecimalCount={this.state.selectedDecimalCount}
            onValueChange={pv =>
              this.setState(
                merge(this.state, {
                  propertyValueSet: PropertyValueSet.set(
                    "a",
                    pv as PropertyValue.PropertyValue,
                    this.state.propertyValueSet
                  )
                })
              )
            }
            filterPrettyPrint={filterPrettyPrint}
            validationFilter={validationFilter}
            readOnly={false}
            isRequiredMessage="Is required"
            notNumericMessage="Not numeric"
            onFormatChanged={(selectedUnit, selectedDecimalCount) =>
              this.setState(
                merge(this.state, { selectedUnit, selectedDecimalCount })
              )
            }
            onFormatCleared={() =>
              this.setState(
                merge(this.state, {
                  selectedUnit: Units.Celsius,
                  selectedDecimalCount: 2
                })
              )
            }
          />
        </div>
      </div>
    );
  }
}

/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import React from "react";
import { Unit, BaseUnits } from "uom";
import { createAmountPropertySelector } from "@promaster-sdk/react-property-selectors";
// import { PropertySelectors } from "../../src";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";
import { merge } from "../utils";
import { units, unitsFormat } from "../units-map";

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly selectedUnit: Unit.Unit<any>;
  readonly selectedDecimalCount: number;
}

const filterPrettyPrint = (
  propertyFilter: PropertyFilter.PropertyFilter
): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.buildEnglishMessages(unitsFormat),
    2,
    " ",
    propertyFilter,
    unitsFormat
  );

const validationFilter = PropertyFilter.fromString(
  "a<100:Celsius"
) as PropertyFilter.PropertyFilter;

const AmountPropertySelector = createAmountPropertySelector({});

export class AmountPropertySelectorExample1 extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString("a=10:Meter"),
      selectedUnit: BaseUnits.Meter,
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
                  selectedUnit: BaseUnits.Meter,
                  selectedDecimalCount: 2
                })
              )
            }
            unitsFormat={unitsFormat}
            units={units}
          />
        </div>
      </div>
    );
  }
}

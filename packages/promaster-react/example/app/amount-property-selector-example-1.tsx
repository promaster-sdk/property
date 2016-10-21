import * as React from "react";
import {PropertySelectors} from "promaster-react";
import {Unit, Units, Amount} from "promaster-primitives";
import {merge} from "./utils";

interface State {
  readonly selectedUnit: Unit.Unit<any>,
  readonly selectedDecimalCount: number,
  readonly amount: Amount.Amount<any>
}

export class AmountFormatSelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      selectedUnit: Units.Celsius,
      amount: Amount.create(10.0, Units.Celsius),
      selectedDecimalCount: 2,
    };
  }

  render() {

    const selectorClassNames = {
      input: "input",
      inputInvalid: "inputInvalid",
      format: "format",
      formatActive: "formatActive",
      unit: "unit",
      precision: "precision",
      cancel: "cancel"
    };

    // console.log("state", this.state);

    return (
      <div>
        <div>
          AmountFormatSelector:
        </div>
        <div>
          <PropertySelectors.AmountPropertySelector
            propertyName="myProp"
            propertyValueSet={{}}
            filterPrettyPrint={}
            validationFilter={}
            inputUnit={this.state.selectedUnit}
            inputDecimalCount={this.state.selectedDecimalCount}
            onValueChange={(amount) => this.setState(merge(this.state, {amount}))}
            readOnly={false}
            isRequiredMessage="Is required"
            notNumericMessage="Not numeric"
            onFormatChanged={(selectedUnit, selectedDecimalCount) => this.setState(merge(this.state, {selectedUnit, selectedDecimalCount}))}
            classNames={selectorClassNames}/>
        </div>
      </div>
    );

  }
}


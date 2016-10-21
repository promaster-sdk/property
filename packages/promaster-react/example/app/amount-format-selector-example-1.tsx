import * as React from "react";
import {AmountInputBox, AmountFormatSelector} from "promaster-react/amount-fields/index";
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
      amount: Amount.create(10.0, Units.Celsius),
      selectedUnit: Units.Celsius,
      selectedDecimalCount: 2,
    };
  }

  render() {

    const boxClassNames = {
      input: "input",
      inputInvalid: "inputInvalid"
    };

    const selectorClassNames = {
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
          Amount: {Amount.toString(this.state.amount)}
        </div>
        <div>
          AmountFormatSelector:
        </div>
        <div>
          <AmountInputBox value={this.state.amount}
                          inputUnit={this.state.selectedUnit}
                          inputDecimalCount={this.state.selectedDecimalCount}
                          onValueChange={(amount) => this.setState(merge(this.state, {amount}))}
                          readOnly={false}
                          classNames={boxClassNames}
                          errorMessage=""
                          isRequiredMessage="Is required"
                          notNumericMessage="Not numeric"/>
          <AmountFormatSelector selectedUnit={this.state.selectedUnit}
                                selectedDecimalCount={this.state.selectedDecimalCount}
                                onFormatChanged={(selectedUnit, selectedDecimalCount) => this.setState(merge(this.state, {selectedUnit, selectedDecimalCount}))}
                                classNames={selectorClassNames}/>
        </div>
      </div>
    );

  }
}


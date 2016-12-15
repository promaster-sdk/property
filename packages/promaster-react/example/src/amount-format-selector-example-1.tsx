import * as React from "react";
import {AmountFields} from "@promaster/promaster-react";
import {Unit, Units, Amount} from "@promaster/promaster-primitives";
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

    return (
      <div>
        <div>
          Amount: {Amount.toString(this.state.amount)}
        </div>
        <div>
          AmountFormatSelector:
        </div>
        <div>
          <AmountFields.AmountInputBox value={this.state.amount}
                          inputUnit={this.state.selectedUnit}
                          inputDecimalCount={this.state.selectedDecimalCount}
                          onValueChange={(amount) => this.setState(merge(this.state, {amount}))}
                          readOnly={false}
                          errorMessage=""
                          isRequiredMessage="Is required"
                          notNumericMessage="Not numeric"/>
          <AmountFields.AmountFormatSelector selectedUnit={this.state.selectedUnit}
                                selectedDecimalCount={this.state.selectedDecimalCount}
                                onFormatChanged={(selectedUnit, selectedDecimalCount) => this.setState(merge(this.state, {selectedUnit, selectedDecimalCount}))}
                                onFormatCleared={() => this.setState(merge(this.state, {selectedUnit: Units.Celsius, selectedDecimalCount: 2}))}
                                />
        </div>
      </div>
    );

  }
}

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
      selectedUnit: Units.Celsius,
      amount: Amount.create(10.0, Units.Celsius),
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

    return (
      <div>
        <div>
          AmountFormatSelector:
        </div>
        <div>
          <AmountInputBox isRequiredMessage="Is required"
                          classNames={boxClassNames}
                          errorMessage=""
                          inputDecimalCount={this.state.selectedDecimalCount}
                          inputUnit={this.state.selectedUnit}
                          notNumericMessage="Not numeric"
                          onValueChange={(amount) => this.setState(merge(this.state, {amount}))}
                          readOnly={false}
                          value={this.state.amount}/>
          <AmountFormatSelector classNames={selectorClassNames}
                                selectedUnit={this.state.selectedUnit}
                                selectedDecimalCount={this.state.selectedDecimalCount}
                                onFormatChanged={(selectedUnit) => this.setState(merge(this.state, {selectedUnit}))}/>
        </div>
      </div>
    );

  }
}


import * as React from "react";
import { AmountFields } from "@promaster/promaster-react";
import { Unit, Units, Amount } from "@promaster/promaster-primitives";
import { merge } from "../utils";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";

// tslint:disable:variable-name no-class no-this no-any

interface State {
  readonly selectedUnit: Unit.Unit<any>,
  readonly selectedDecimalCount: number,
  readonly amount: Amount.Amount<any>
}

// Usage with standard css
const ClearButton = (props: React.HTMLProps<HTMLButtonElement>) => <button {...props} className="my-own">Clear</button >;
const AmountFormatWrapper = (props: AmountFields.AmountFormatWrapperProps) =>
  <AmountFields.AmountFormatWrapper className={props.active ? "active" : "inactive"} {...props} />;

// Usage with styled components
const precisionSelector = styled.select`
  background: #eee;
  font-size: 15px;
`;

const AmountFormatSelector = AmountFields.createAmountFormatSelector({
  PrecisionSelector: precisionSelector,
  ClearButton: ClearButton,
  AmountFormatWrapper: AmountFormatWrapper
});

const AmountInputBox = AmountFields.createAmountInputBox({});

export class AmountFormatSelectorExample1 extends React.Component<{}, State> {

  constructor() {
    super();
    this.state = {
      amount: Amount.create(10.0, Units.Celsius),
      selectedUnit: Units.Celsius,
      selectedDecimalCount: 2,
    };
  }

  render(): React.ReactElement<{}> {

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
            onValueChange={(amount) => {
              //console.log("changed");
              this.setState(merge(this.state, { amount }));
            }}
            readOnly={false}
            errorMessage=""
            isRequiredMessage="Is required"
            notNumericMessage="Not numeric"
            debounceTime={350} />
          <AmountFormatSelector selectedUnit={this.state.selectedUnit}
            selectedDecimalCount={this.state.selectedDecimalCount}
            onFormatChanged={(selectedUnit: Unit.Unit<any>, selectedDecimalCount: number) =>
              this.setState(merge(this.state, { selectedUnit, selectedDecimalCount }))}
            onFormatCleared={() => this.setState(merge(this.state, { selectedUnit: Units.Celsius, selectedDecimalCount: 2 }))}
            onFormatSelectorActiveChanged={action("Toggle format selector")}
          />
        </div>
      </div>
    );

  }
}

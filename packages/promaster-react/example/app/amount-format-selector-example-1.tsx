import * as React from "react";
import {AmountInputBox, AmountFormatSelector} from "promaster-react/amount-fields/index";
import {Unit, Units, Amount} from "promaster-primitives";
import {merge} from "./utils";

interface State {
    readonly selectedUnit: Unit.Unit<any>;
}

export class AmountFormatSelectorExample1 extends React.Component<{}, State> {

    constructor() {
        this.state = {selectedUnit: Units.Celsius};
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
                                    inputDecimalCount={3}
                                    inputUnit={Units.Celsius}
                                    notNumericMessage="Not numeric"
                                    onValueChange={() => console.log("Value changed.")}
                                    readOnly={false}
                                    value={Amount.create(10.0, Units.Celsius)}/>
                    <AmountFormatSelector classNames={selectorClassNames}
                                          selectedUnit={this.state.selectedUnit}
                                          selectedDecimalCount={2}
                                          onFormatChanged={(u) => this.setState(merge(this.state, {selectedUnit: u}))}/>
                </div>
            </div>
        );

    }
}


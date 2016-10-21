import * as React from "react";
import {AmountInputBox, AmountFormatSelector} from "promaster-react/amount-fields/index";
import {Units, Amount} from "promaster-primitives";

export function AmountFormatSelectorExample1() {

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
                                      selectedUnit={Units.Celsius}
                                      selectedDecimalCount={2}
                                      onFormatChanged={() => 1}/>
            </div>
        </div>
    );

}

import * as React from "react";
import {AmountInputBox} from "promaster-react/amount-fields/index";
import {Units, Amount} from "promaster-primitives";

export function AmountInputBoxExample1() {

    return (
        <div>
            <div>
                Amount Input Box:
            </div>
            <div>
                <AmountInputBox isRequiredMessage="Is required"
                                classNames={{input: "input", inputInvalid: "inputInvalid"}}
                                errorMessage=""
                                inputDecimalCount={3}
                                inputUnit={Units.Celsius}
                                notNumericMessage="Not numeric"
                                onValueChange={() => console.log("Value changed.")}
                                readOnly={false}
                                value={Amount.create(10.0, Units.Celsius)}/>
            </div>
        </div>
    );

}

import React from "react";
import ReactDOM from "react-dom";
import {AmountInputBox} from "promaster-react/amount-fields/index";
import {Units, Amount} from "promaster-primitives";
import {ExampleSelector} from "./example-selector";

ReactDOM.render(
    <h1>
        Hello, world!
        <AmountFieldExample1/>
        <ExampleSelector/>
    </h1>,
    document.getElementById('root')
);

function AmountFieldExample1() {

    return (
        <div>
            Mitt fina amount field!
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
    );

}

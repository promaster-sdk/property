import React from "react";
import ReactDOM from "react-dom";
import {AmountInputBox} from "promaster-react/amount-fields/index";
//import {Units, Amount} from "promaster-primitives";
import {Amount} from "promaster-primitives/lib/src/class/measure/amount";
import {Units} from "promaster-primitives/lib/src/class/measure/unit/units";

console.log("AmountFields", AmountInputBox);
console.log("Amount", Amount);
console.log("Units", Units);
//console.log("Olle", Olle);

ReactDOM.render(
	<h1>Hello, world!<AmountFieldExample1 />  </h1>,
	document.getElementById('root')
);

// ReactDOM.render(
// 	React.createElement('div', {}, "HELLO!!"),
// 	document.getElementById('root')
// );

console.log("hello!!");


function AmountFieldExample1() {

	return (
		<div>Mitt fina amount field!
			<AmountInputBox
				isRequiredMessage="Is required"
				classNames={{input: "input", inputInvalid: "inputInvalid"}}
				errorMessage="This is the error message"
				inputDecimalCount={2}
				inputUnit={Units.Celsius}
				notNumericMessage="Not numeric"
				onValueChange={() => null}
				readOnly={false}
				value={Amount.create(10.0, Units.Celsius)}
			/> </div>
	);

}

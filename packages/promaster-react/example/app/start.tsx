import React from "react";
import ReactDOM from "react-dom";
import {AmountInputBox} from "promaster-react/amount-fields/index";

console.log("AmountFields", AmountInputBox);

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
		<div>Mitt fina amount field!<AmountInputBox /> </div>
	);

}

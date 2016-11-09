import {csjs} from "csjs";
import {insertCss} from "../utils/insert-css";

export interface AmountInputBoxStyles {
  readonly input: string,
  readonly inputInvalid: string,
  readonly inputLocked: string,
  readonly inputInvalidLocked: string,
}

export const amountInputBoxStyles: AmountInputBoxStyles = csjs`
  .input {
    color: black;
    height: 30px;
    border: 1px solid #b4b4b4;
    border-radius: 3px;
    font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
    outline: rgb(131, 131, 131) none 0px;
    padding: 1px 30px 0px 10px;
  }

  .inputInvalid extends .input {
    color: red;
  }

  .inputLocked extends .input {
    background: lightgray;
    color: darkgray;
    border: none;
  }

  .inputInvalidLocked extends .input {
    background: lightgray;
    color: red;
    border: none;    
  }
`;

insertCss(csjs.getCss(amountInputBoxStyles));

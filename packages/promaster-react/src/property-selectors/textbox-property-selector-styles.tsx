import {csjs} from "csjs";
import insertCss from "insert-css";

export interface TextboxPropertySelectorStyles {
  readonly textbox: string,
  readonly textboxInvalid: string,
  readonly textboxLocked: string,
  readonly textboxInvalidLocked: string,
}

export const textboxPropertySelectorStyles: TextboxPropertySelectorStyles = csjs`
  .textbox {
    color: black;
    height: 30px;
    border: 1px solid #b4b4b4;
    border-radius: 3px;
    font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
    outline: rgb(131, 131, 131) none 0px;
    padding: 1px 30px 0px 10px;
  }

  .textboxInvalid extends .textbox {
    color: red;
  }

  .textboxLocked extends .textbox {
    background: lightgray;
    color: darkgray;
    border: none;
  }

  .textboxInvalidLocked extends .textbox {
    background: lightgray;
    color: red;
    border: none;    
  }
`;

insertCss(csjs.getCss(textboxPropertySelectorStyles));

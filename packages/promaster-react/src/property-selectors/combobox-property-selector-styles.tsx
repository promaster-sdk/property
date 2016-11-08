import csjs from "csjs";
import insertCss from "insert-css";

export interface ComboboxPropertySelectorStyles {
  readonly select: string,
  readonly selectInvalid: string,
  readonly selectLocked: string,
  readonly selectInvalidLocked: string,
  readonly option: string,
  readonly optionInvalid: string,
}

const borderColor = "#b4b4b4";
//const borderColor = "#00ff00";
const subtleBorderRadius = "3px";

export const comboboxPropertySelectorStyles: ComboboxPropertySelectorStyles = csjs`
  .select {
    color: black;
    height: 30px;
    border: 1px solid ${borderColor};
    border-radius: ${subtleBorderRadius};
    font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
    outline: rgb(131, 131, 131) none 0px;
    padding: 1px 30px 0px 10px;
  }

  .selectInvalid extends .select {
    color: red;
  }

  .selectLocked {
    background: lightgray;
    color: darkgray;
    border: none;
  }

  .selectInvalidLocked {
  }

  .option {
    color: rgb(131, 131, 131);
    min-height: 18px;
    align-self: center;
    border: 0px none rgb(131, 131, 131);
    font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
    outline: rgb(131, 131, 131) none 0px;
  }

  .optionInvalid extends .option {
    color: red;
  }
`;

insertCss(csjs.getCss(comboboxPropertySelectorStyles));

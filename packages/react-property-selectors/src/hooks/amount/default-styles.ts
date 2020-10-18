import { UseAmountInputBox } from "./use-amount-input-box";

export function getDefaultAmountInputBoxStyle(selector: UseAmountInputBox): {} {
  return {
    color: !selector.readOnly && selector.effectiveErrorMessage ? "red" : "black",
    height: "30px",
    border: "1px solid #b4b4b4",
    borderRadius: "3px",
    font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
    outline: "rgb(131, 131, 131) none 0px",
    padding: "1px 30px 0px 10px",

    ...inputInvalidLocked(selector),
    ...inputLocked(selector),
  };
}

function inputInvalidLocked({ readOnly, effectiveErrorMessage }: UseAmountInputBox): {} {
  if (readOnly && effectiveErrorMessage) {
    return {
      background: "lightgray",
      color: "red",
      border: "none",
    };
  }
  return {};
}

function inputLocked({ readOnly, effectiveErrorMessage }: UseAmountInputBox): {} {
  if (readOnly && !effectiveErrorMessage) {
    return {
      background: "lightgray",
      color: "darkgray",
      border: "none",
    };
  }
  return {};
}

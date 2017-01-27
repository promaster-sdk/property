/*
 UI to enter an Amount. It will be entered in a specified unit and decimal count.
 The passed Amount value will be converted to the specified unit and decimal count if needed.
 The UI will ensure that the value is numeric before emitting a change event.
 It is also allowed to have a blank input in which case a change event with value of undefined will be emitted.
 */
import * as React from "react";
import { Amount, Unit } from "@promaster/promaster-primitives";
import { Quantity } from "@promaster/promaster-primitives";
import { amountInputBoxStyles, AmountInputBoxStyles } from "./amount-input-box-styles";

export interface AmountInputBoxProps {
  readonly key?: string,
  readonly value: Amount.Amount<any> | undefined,
  readonly inputUnit: Unit.Unit<any>,
  readonly inputDecimalCount: number,
  readonly notNumericMessage: string,
  readonly isRequiredMessage: string,
  readonly errorMessage: string,
  readonly readOnly: boolean,
  readonly onValueChange: (newAmount: Amount.Amount<any>) => void,
  readonly styles?: AmountInputBoxStyles,
  readonly debounceTime: number,
}

export interface State {
  readonly textValue: string,
  readonly isValid: boolean,
  readonly effectiveErrorMessage: string
}

export class AmountInputBox extends React.Component<AmountInputBoxProps, State> {

  constructor(props: AmountInputBoxProps) {
    super(props);
    // What the optimal debounce is may vary between users. 350ms seems like a nice value...
    this._debouncedOnValueChange = debounce(this, this._debouncedOnValueChange, this.props.debounceTime);
  }

  componentWillMount() {
    this.initStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps: AmountInputBoxProps) {
    this.initStateFromProps(nextProps);
  }

  initStateFromProps(initProps: AmountInputBoxProps) {
    const {value, inputUnit, inputDecimalCount} = initProps;
    if (!inputUnit)
      console.error("Missing inputUnit");
    if (!(inputDecimalCount !== null && inputDecimalCount !== undefined))
      console.error("Missing inputDecimalCount");
    const formattedValue = formatWithUnitAndDecimalCount(value, inputUnit, inputDecimalCount);
    const newState = calculateNewState(formattedValue,
      initProps.isRequiredMessage, initProps.notNumericMessage, initProps.errorMessage);
    this.setState(newState);
  }

  render() {

    const {onValueChange, readOnly, styles = amountInputBoxStyles} = this.props;
    const {effectiveErrorMessage, textValue} = this.state;

    return (
      <input key="input"
        type="text"
        value={textValue}
        readOnly={readOnly}
        onChange={(e: any) => this._onChange(e, onValueChange)}
        title={effectiveErrorMessage}
        className={effectiveErrorMessage ? styles.inputInvalid : styles.input} />
    );

  }

  _debouncedOnValueChange(newAmount: Amount.Amount<any>, onValueChange: (newAmount: Amount.Amount<any>) => void): void {
    // log("jk", "_debouncedOnValueChange");
    // An event can have been received when the input was valid, then the input has gone invalid
    // but we still received the delayed event from when the input was valid. Therefore
    // we need an extra check here to make sure that the current input is valid before we
    // dispatch the value change.
    if (this.state.isValid)
      onValueChange(newAmount);
  }

  _onChange(e: React.SyntheticEvent<any>, onValueChange: (newAmount: Amount.Amount<any>) => void) {
    const newStringValue = (e.target as HTMLInputElement).value.replace(",", ".");
    const {inputUnit, inputDecimalCount} = this.props;

    // If the change would add more decimals than allowed then ignore the change
    const stringDecimalCount = getDecimalCountFromString(newStringValue);
    if (stringDecimalCount > inputDecimalCount)
      return;

    // Update the internal state and if the change resulted in a valid value then emit a change with that value
    const newAmount = unformatWithUnitAndDecimalCount(newStringValue, inputUnit, inputDecimalCount);
    const newState = calculateNewState(newStringValue,
      this.props.isRequiredMessage, this.props.notNumericMessage, this.props.errorMessage);
    this.setState(newState);
    // We need to check isValid from the new state because state is not immidiately mutated
    if (newState.isValid && newAmount)
      this._debouncedOnValueChange(newAmount, onValueChange);
  }

}

function calculateNewState(newStringValue: string,
  isRequiredMessage: string, notNumericMessage: string, errorMessage: string): State {
  const internalErrorMessage = getInternalErrorMessage(newStringValue, isRequiredMessage, notNumericMessage);
  if (internalErrorMessage) {
    return { isValid: false, textValue: newStringValue, effectiveErrorMessage: internalErrorMessage };
  }
  else {
    return { isValid: true, textValue: newStringValue, effectiveErrorMessage: errorMessage };
  }
}


function getInternalErrorMessage(newStringValue: string,
  isRequiredMessage: string,
  notNumericMessage: string): string | undefined {

  // Check if blank and if required or not
  if (newStringValue.trim() === "" && isRequiredMessage) {
    // The user has not entred anything, but a value was required
    return isRequiredMessage;
  }
  if (newStringValue.trim() !== "") {
    // The user has entered something, but it could not be converted to an amount (=was not numeric)
    return notNumericMessage;
  }
  return undefined;

}

function formatWithUnitAndDecimalCount<T extends Quantity.Quantity>(amount: Amount.Amount<T> | undefined, unit: Unit.Unit<T>, decimalCount: number): string {
  if (!amount)
    return "";

  // Determine the value to use
  let valueToUse: number;
  if (amount.unit === unit) {
    // No conversion needed, use the original number of decimals in the amount
    valueToUse = amount.value;
    // Determine number of decimals
    if (amount.decimalCount <= decimalCount)
      return valueToUse.toFixed(amount.decimalCount);
    else
      return valueToUse.toFixed(decimalCount);
  }
  else {
    // Conversion needed, use the max number of decimals so the conversion
    // result is as accurate as possible
    valueToUse = Amount.valueAs(unit, amount);
    return valueToUse.toFixed(decimalCount);
  }
}

function unformatWithUnitAndDecimalCount<T extends Quantity.Quantity>(text: string, unit: Unit.Unit<T>, inputDecimalCount: number): Amount.Amount<T> | undefined {
  if (!text || text.length === 0)
    return undefined;
  const parsedFloatValue = filterFloat(text);
  if (isNaN(parsedFloatValue))
    return undefined;
  // Keep number of decimals from the entered text except if they are more than the formats decimal count
  const textDecimalCount = getDecimalCountFromString(text);
  const finalDecimalCount = textDecimalCount > inputDecimalCount ? inputDecimalCount : textDecimalCount;
  const finalFloatValue = textDecimalCount > inputDecimalCount ? parseFloat(parsedFloatValue.toFixed(inputDecimalCount)) : parsedFloatValue;
  return Amount.create(finalFloatValue, unit, finalDecimalCount);
}

function getDecimalCountFromString(stringValue: string) {
  const pointIndex = stringValue.indexOf('.');
  if (pointIndex >= 0)
    return stringValue.length - pointIndex - 1;
  return 0;
}

function filterFloat(value: string): number {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
    .test(value))
    return Number(value);
  return NaN;
}


// (From underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(_this: any, func: Function, wait: number): any {
  let timeout: any;

  return function () {
    const args = arguments;

    const later = function () {
      timeout = null;
      func.apply(_this, args);
    };

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
  }
}
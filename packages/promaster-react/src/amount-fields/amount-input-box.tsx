/*
 UI to enter an Amount. It will be entered in a specified unit and decimal count.
 The passed Amount value will be converted to the specified unit and decimal count if needed.
 The UI will ensure that the value is numeric before emitting a change event.
 It is also allowed to have a blank input in which case a change event with value of undefined will be emitted.
 */
import * as React from "react";
import { Amount, Unit } from "@promaster/promaster-primitives";
import { Quantity } from "@promaster/promaster-primitives";
import styled, * as StyledComponents from "styled-components";
import { AmountInputField, AmountInputFieldProps } from "./amount-input-field";

// tslint:disable no-class no-this

export interface AmountInputBoxProps {
  readonly key?: string;
  readonly value: Amount.Amount<Quantity.Quantity> | undefined;
  readonly inputUnit: Unit.Unit<Quantity.Quantity>;
  readonly inputDecimalCount: number;
  readonly notNumericMessage: string;
  readonly isRequiredMessage: string;
  readonly errorMessage: string;
  readonly readOnly: boolean;
  readonly onValueChange: (newAmount: Amount.Amount<Quantity.Quantity>) => void;
  readonly debounceTime: number;
}

export interface State {
  readonly textValue: string;
  readonly isValid: boolean;
  readonly effectiveErrorMessage: string;
}

export type AmountInputBox = React.ComponentClass<AmountInputBoxProps>;

export interface CreateAmountInputBoxParams {
  readonly AmountInputField?: React.ComponentType<AmountInputFieldProps>;
}

function inputInvalidLocked({
  isReadonly,
  effectiveErrorMessage
}: AmountInputFieldProps): StyledComponents.InterpolationValue[] {
  // tslint:disable-next-line:no-console
  if (isReadonly && effectiveErrorMessage) {
    return StyledComponents.css`
    background: lightgray;
    color: red;
    border: none;
  `;
  }

  return [];
}

function inputLocked({
  isReadonly,
  effectiveErrorMessage
}: AmountInputFieldProps): StyledComponents.InterpolationValue[] {
  if (isReadonly && !effectiveErrorMessage) {
    return StyledComponents.css`
    background: lightgray;
    color: darkgray;
    border: none;
  `;
  }

  return [];
}

export const defaultAmountInputField = styled(AmountInputField)`
  color: black;
  height: 30px;
  border: 1px solid #b4b4b4;
  border-radius: 3px;
  font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
  outline: rgb(131, 131, 131) none 0px;
  padding: 1px 30px 0px 10px;

  ${props => inputInvalidLocked(props)}

  ${props => inputLocked(props)}

  ${props =>
    !props.isReadonly && props.effectiveErrorMessage ? "color: red" : ""}
`;

export function createAmountInputBox({
  AmountInputField = defaultAmountInputField
}: CreateAmountInputBoxParams): AmountInputBox {
  return class AmountInputBox extends React.Component<
    AmountInputBoxProps,
    State
  > {
    constructor(props: AmountInputBoxProps) {
      super(props);
      // What the optimal debounce is may vary between users. 350ms seems like a nice value...
      this._debouncedOnValueChange = debounce(
        this,
        this._debouncedOnValueChange,
        this.props.debounceTime
      );
    }

    componentWillMount(): void {
      this.initStateFromProps(this.props);
    }

    componentWillReceiveProps(nextProps: AmountInputBoxProps): void {
      this.initStateFromProps(nextProps);
    }

    initStateFromProps(initProps: AmountInputBoxProps): void {
      const { value, inputUnit, inputDecimalCount } = initProps;
      if (!inputUnit) {
        // tslint:disable-next-line:no-console
        console.error("Missing inputUnit");
      }
      if (!(inputDecimalCount !== null && inputDecimalCount !== undefined)) {
        // tslint:disable-next-line:no-console
        console.error("Missing inputDecimalCount");
      }
      const formattedValue = formatWithUnitAndDecimalCount(
        value,
        inputUnit,
        inputDecimalCount
      );
      const newState = calculateNewState(
        value,
        formattedValue,
        initProps.isRequiredMessage,
        initProps.notNumericMessage,
        initProps.errorMessage
      );
      this.setState(newState);
    }

    render(): React.ReactElement<AmountInputBoxProps> {
      const { onValueChange, readOnly } = this.props;
      const { effectiveErrorMessage, textValue } = this.state;
      // const test = (<input type="text" />);
      return (
        <AmountInputField
          key="input"
          value={textValue}
          readOnly={readOnly}
          onChange={e => this._onChange(e, onValueChange)}
          title={effectiveErrorMessage}
          effectiveErrorMessage={effectiveErrorMessage}
          isReadonly={readOnly}
        />
      );
    }

    _debouncedOnValueChange(
      newAmount: Amount.Amount<Quantity.Quantity> | undefined,
      onValueChange: (
        newAmount: Amount.Amount<Quantity.Quantity> | undefined
      ) => void
    ): void {
      // An event can have been received when the input was valid, then the input has gone invalid
      // but we still received the delayed event from when the input was valid. Therefore
      // we need an extra check here to make sure that the current input is valid before we
      // dispatch the value change.
      if (this.state.isValid) {
        onValueChange(newAmount);
      }
    }

    _onChange(
      e: React.FormEvent<HTMLInputElement>,
      onValueChange: (newAmount: Amount.Amount<Quantity.Quantity>) => void
    ): void {
      const newStringValue = e.currentTarget.value.replace(",", ".");
      const { inputUnit, inputDecimalCount } = this.props;

      // If the change would add more decimals than allowed then ignore the change
      const stringDecimalCount = getDecimalCountFromString(newStringValue);
      if (stringDecimalCount > inputDecimalCount) {
        return;
      }

      // Update the internal state and if the change resulted in a valid value then emit a change with that value
      const newAmount = unformatWithUnitAndDecimalCount(
        newStringValue,
        inputUnit,
        inputDecimalCount
      );
      const newState = calculateNewState(
        newAmount,
        newStringValue,
        this.props.isRequiredMessage,
        this.props.notNumericMessage,
        this.props.errorMessage
      );
      this.setState(newState);
      // We need to check isValid from the new state because state is not immidiately mutated
      if (newState.isValid) {
        this._debouncedOnValueChange(newAmount, onValueChange);
      }
    }
  };
}

function calculateNewState(
  newAmount: Amount.Amount<Quantity.Quantity> | undefined,
  newStringValue: string,
  isRequiredMessage: string,
  notNumericMessage: string,
  errorMessage: string
): State {
  const internalErrorMessage = getInternalErrorMessage(
    newAmount,
    newStringValue,
    isRequiredMessage,
    notNumericMessage
  );
  if (internalErrorMessage) {
    return {
      isValid: false,
      textValue: newStringValue,
      effectiveErrorMessage: internalErrorMessage
    };
  } else {
    return {
      isValid: true,
      textValue: newStringValue,
      effectiveErrorMessage: errorMessage
    };
  }
}

function getInternalErrorMessage(
  newAmount: Amount.Amount<Quantity.Quantity> | undefined,
  newStringValue: string,
  isRequiredMessage: string,
  notNumericMessage: string
): string | undefined {
  // Check if blank and if required or not
  if (newStringValue.trim() === "" && isRequiredMessage) {
    // The user has not entred anything, but a value was required
    return isRequiredMessage;
  }
  if (newStringValue.trim() !== "" && !newAmount && isRequiredMessage) {
    // The user has entered something, but it could not be converted to an amount (=was not numeric)
    return notNumericMessage;
  }
  return undefined;
}

function formatWithUnitAndDecimalCount<T extends Quantity.Quantity>(
  amount: Amount.Amount<T> | undefined,
  unit: Unit.Unit<T>,
  decimalCount: number
): string {
  if (!amount) {
    return "";
  }

  // Determine the value to use
  let valueToUse: number;
  if (amount.unit === unit) {
    // No conversion needed, use the original number of decimals in the amount
    valueToUse = amount.value;
    // Determine number of decimals
    if (amount.decimalCount <= decimalCount) {
      return valueToUse.toFixed(amount.decimalCount);
    } else {
      return valueToUse.toFixed(decimalCount);
    }
  } else {
    // Conversion needed, use the max number of decimals so the conversion
    // result is as accurate as possible
    valueToUse = Amount.valueAs(unit, amount);
    return valueToUse.toFixed(decimalCount);
  }
}

function unformatWithUnitAndDecimalCount<T extends Quantity.Quantity>(
  text: string,
  unit: Unit.Unit<T>,
  inputDecimalCount: number
): Amount.Amount<T> | undefined {
  if (!text || text.length === 0) {
    return undefined;
  }
  const parsedFloatValue = filterFloat(text);
  if (isNaN(parsedFloatValue)) {
    return undefined;
  }
  // Keep number of decimals from the entered text except if they are more than the formats decimal count
  const textDecimalCount = getDecimalCountFromString(text);
  const finalDecimalCount =
    textDecimalCount > inputDecimalCount ? inputDecimalCount : textDecimalCount;
  const finalFloatValue =
    textDecimalCount > inputDecimalCount
      ? parseFloat(parsedFloatValue.toFixed(inputDecimalCount))
      : parsedFloatValue;
  return Amount.create(finalFloatValue, unit, finalDecimalCount);
}

function getDecimalCountFromString(stringValue: string): number {
  const pointIndex = stringValue.indexOf(".");
  if (pointIndex >= 0) {
    return stringValue.length - pointIndex - 1;
  }
  return 0;
}

function filterFloat(value: string): number {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
}

// (From underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds.
function debounce(_this: any, func: Function, wait: number): any {
  //tslint:disable-line
  let timeout: NodeJS.Timer | null;
  return function(): void {
    const args = arguments; //tslint:disable-line
    const later = function(): void {
      timeout = null;
      func.apply(_this, args);
    };
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
  };
}

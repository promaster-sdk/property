/*
 UI to enter an Amount. It will be entered in a specified unit and decimal count.
 The passed Amount value will be converted to the specified unit and decimal count if needed.
 The UI will ensure that the value is numeric before emitting a change event.
 It is also allowed to have a blank input in which case a change event with value of undefined will be emitted.
 */
import React, { useCallback, useState } from "react";
import { Amount, Unit } from "uom";

export type UseAmountInputBoxOptions = {
  readonly key?: string;
  readonly value: Amount.Amount<unknown> | undefined;
  readonly inputUnit: Unit.Unit<unknown>;
  readonly inputDecimalCount: number;
  readonly notNumericMessage: string;
  readonly isRequiredMessage: string;
  readonly errorMessage: string;
  readonly readOnly: boolean;
  readonly onValueChange: (newAmount: Amount.Amount<unknown>) => void;
  readonly debounceTime: number;
};

export type AmountInputBoxInputProps = {
  readonly value: string;
  readonly title: string;
  readonly readOnly: boolean;
  readonly onFocus?: React.FocusEventHandler<{}>;
  readonly onBlur?: React.FocusEventHandler<{}>;
  readonly onChange: React.ChangeEventHandler<{ readonly value: string }>;
};

export type GetInputPropsOptions = {
  readonly onFocus?: React.FocusEventHandler<{}>;
  readonly onBlur?: React.FocusEventHandler<{}>;
};

export type UseAmountInputBox = {
  readonly readOnly: boolean;
  readonly effectiveErrorMessage: string;
  // readonly getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  readonly getInputProps: (options?: GetInputPropsOptions) => AmountInputBoxInputProps;
};

type State = {
  readonly textValue: string;
  readonly isValid: boolean;
  readonly effectiveErrorMessage: string;
};

export function useAmountInputBox(options: UseAmountInputBoxOptions): UseAmountInputBox {
  const { readOnly, onValueChange, debounceTime } = options;
  const [state, setState] = useState<State>(initStateFromParams(options));

  // Re-init state if specific params change
  React.useEffect(() => {
    const newState = initStateFromParams(options);
    setState(newState);
  }, [
    options.inputUnit,
    options.inputDecimalCount,
    options.isRequiredMessage,
    options.notNumericMessage,
    options.errorMessage,
    options.value,
  ]);

  const debouncedOnValueChange = useCallback(
    debounce((newAmount: Amount.Amount<unknown> | undefined) => {
      // An event can have been received when the input was valid, then the input has gone invalid
      // but we still received the delayed event from when the input was valid. Therefore
      // we need an extra check here to make sure that the current input is valid before we
      // dispatch the value change.
      if (state.isValid && newAmount) {
        onValueChange(newAmount);
      }
    }, debounceTime),
    [onValueChange, debounceTime]
  );

  const { effectiveErrorMessage, textValue } = state;
  return {
    readOnly,
    effectiveErrorMessage,
    getInputProps: ({ onFocus, onBlur }: GetInputPropsOptions = {}) => ({
      value: textValue,
      title: effectiveErrorMessage,
      readOnly,
      onBlur,
      onFocus,
      onChange: (e) => _onChange(debouncedOnValueChange, setState, options, e),
    }),
  };
}

type StateInitParams = {
  readonly inputUnit: Unit.Unit<unknown>;
  readonly inputDecimalCount: number;
  readonly isRequiredMessage: string;
  readonly notNumericMessage: string;
  readonly errorMessage: string;
  readonly value: Amount.Amount<unknown> | undefined;
};

function initStateFromParams({
  inputUnit,
  inputDecimalCount,
  isRequiredMessage,
  notNumericMessage,
  errorMessage,
  value,
}: StateInitParams): State {
  if (!inputUnit) {
    console.error("Missing inputUnit");
  }
  if (!(inputDecimalCount !== null && inputDecimalCount !== undefined)) {
    console.error("Missing inputDecimalCount", inputDecimalCount);
  }
  const formattedValue = formatWithUnitAndDecimalCount(value, inputUnit, inputDecimalCount);
  const newState = calculateNewState(value, formattedValue, isRequiredMessage, notNumericMessage, errorMessage);
  return newState;
}

function _onChange(
  debouncedOnValueChange: (newAmount: Amount.Amount<unknown> | undefined) => void,
  setState: React.Dispatch<React.SetStateAction<State>>,
  params: UseAmountInputBoxOptions,
  e: React.ChangeEvent<{ readonly value: string }>
): void {
  const newStringValue = e.target.value.replace(",", ".");
  const { inputUnit, inputDecimalCount } = params;

  // If the change would add more decimals than allowed then ignore the change
  const stringDecimalCount = getDecimalCountFromString(newStringValue);
  if (stringDecimalCount > inputDecimalCount) {
    return;
  }

  // Update the internal state and if the change resulted in a valid value then emit a change with that value
  const newAmount = unformatWithUnitAndDecimalCount(newStringValue, inputUnit, inputDecimalCount);
  const newState = calculateNewState(
    newAmount,
    newStringValue,
    params.isRequiredMessage,
    params.notNumericMessage,
    params.errorMessage
  );
  setState(newState);
  debouncedOnValueChange(newAmount);
}

function calculateNewState(
  newAmount: Amount.Amount<unknown> | undefined,
  newStringValue: string,
  isRequiredMessage: string,
  notNumericMessage: string,
  errorMessage: string
): State {
  const internalErrorMessage = getInternalErrorMessage(newAmount, newStringValue, isRequiredMessage, notNumericMessage);
  if (internalErrorMessage) {
    return {
      isValid: false,
      textValue: newStringValue,
      effectiveErrorMessage: internalErrorMessage,
    };
  } else {
    return {
      isValid: true,
      textValue: newStringValue,
      effectiveErrorMessage: errorMessage,
    };
  }
}

function getInternalErrorMessage(
  newAmount: Amount.Amount<unknown> | undefined,
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

function formatWithUnitAndDecimalCount<T>(
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

function unformatWithUnitAndDecimalCount<T>(
  text: string,
  unit: Unit.Unit<T>,
  inputDecimalCount: number
): Amount.Amount<T> | undefined {
  if (!text || text.length === 0) {
    return undefined;
  }
  const parsedFloatValue = filterFloat(text);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(parsedFloatValue)) {
    return undefined;
  }
  // Keep number of decimals from the entered text except if they are more than the formats decimal count
  const textDecimalCount = getDecimalCountFromString(text);
  const finalDecimalCount = textDecimalCount > inputDecimalCount ? inputDecimalCount : textDecimalCount;
  const finalFloatValue =
    textDecimalCount > inputDecimalCount ? parseFloat(parsedFloatValue.toFixed(inputDecimalCount)) : parsedFloatValue;
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
  // eslint-disable-next-line no-useless-escape
  if (/^(\-|\+)?([0-9]*?(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
}

// (From underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce(func: Function, wait: number): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any;
  return function (): void {
    const args = arguments; //eslint-disable-line
    const later = function (): void {
      timeout = null;
      func.apply({}, args);
    };
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
  };
}

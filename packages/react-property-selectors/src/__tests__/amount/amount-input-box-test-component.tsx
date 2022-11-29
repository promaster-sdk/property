import React, { useCallback, useState } from "react";
import { Amount, Unit } from "uom";
import { getDefaultAmountInputBoxStyle, useAmountInputBox } from "../../amount";

interface State {
  readonly value: Amount.Amount<unknown> | undefined;
}

export function AmountInputBoxTestComponent({
  onValueChange,
  initialValue,
}: {
  readonly onValueChange: (a: Amount.Amount<unknown>) => void;
  readonly initialValue: number | undefined;
}): React.ReactElement<{}> {
  const value: Amount.Amount<unknown> | undefined =
    initialValue !== undefined ? Amount.create(initialValue, Unit.One) : initialValue;

  const [state, setState] = useState<State>({
    value,
  });

  const onValueChangeInternal = useCallback(
    (v) => {
      setState({
        ...state,
        value: v,
      });
      onValueChange(v);
    },
    [state, setState]
  );

  const amountInputBox = useAmountInputBox({
    value: state.value,
    inputUnit: Unit.One,
    inputDecimalCount: 2,
    notNumericMessage: "notNumericMessage",
    isRequiredMessage: "isRequiredMessage",
    readOnly: false,
    debounceTime: 100,
    errorMessage: "",
    onValueChange: onValueChangeInternal,
  });

  return (
    <div>
      <div>AmountInputBox:</div>
      <div>Value: {state?.value !== undefined ? Amount.toString(state.value) : "undefined"}</div>
      <input
        data-testid="input"
        type="text"
        {...amountInputBox.getInputProps()}
        style={getDefaultAmountInputBoxStyle(amountInputBox)}
      />
    </div>
  );
}

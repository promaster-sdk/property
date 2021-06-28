import React, { useCallback, useState } from "react";
import { Amount, Unit } from "uom";
import { getDefaultAmountInputBoxStyle, useAmountInputBox } from "../../amount";

interface State {
  readonly value: Amount.Amount<unknown>;
}

export function AmountInputBoxTestComponent(): React.ReactElement<{}> {
  const value: Amount.Amount<unknown> | undefined = Amount.create(10, Unit.One);

  const [state, setState] = useState<State>({
    value,
  });

  const onValueChange = useCallback(
    (v) =>
      setState({
        ...state,
        value: v,
      }),
    [state, setState]
  );

  const amountInputBox = useAmountInputBox({
    value: state.value,
    inputUnit: Unit.One,
    inputDecimalCount: 2,
    notNumericMessage: "notNumericMessage",
    isRequiredMessage: "isRequiredMessage",
    readOnly: false,
    debounceTime: 1000,
    errorMessage: "",
    onValueChange,
  });

  return (
    <div>
      <div>AmountInputBox:</div>
      <div>Value: {Amount.toString(state.value)}</div>
      <input
        data-testid="input"
        type="text"
        {...amountInputBox.getInputProps()}
        style={getDefaultAmountInputBoxStyle(amountInputBox)}
      />
    </div>
  );
}

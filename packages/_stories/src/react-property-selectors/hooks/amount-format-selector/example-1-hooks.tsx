import React, { useCallback, useState } from "react";
import {
  getDefaultAmountInputBoxStyle,
  useAmountFormatSelector,
  useAmountInputBox,
} from "@promaster-sdk/react-property-selectors";
import { Unit, Amount, BaseUnits } from "uom";
import { units, unitsFormat } from "../../units-map";

type State = {
  readonly selectedUnit: Unit.Unit<unknown>;
  readonly selectedDecimalCount: number;
  readonly amount: Amount.Amount<unknown>;
};

export function AmountFormatSelectorExample1Hooks(): React.ReactElement<{}> {
  const [state, setState] = useState<State>({
    amount: Amount.create(10.0, BaseUnits.Meter),
    selectedUnit: BaseUnits.Meter,
    selectedDecimalCount: 2,
  });

  const onValueChange = useCallback(
    (amount) => {
      setState({ ...state, amount });
    },
    [state, setState]
  );

  const selA = useAmountInputBox({
    value: state.amount,
    inputUnit: state.selectedUnit,
    inputDecimalCount: state.selectedDecimalCount,
    onValueChange,
    readOnly: false,
    errorMessage: "",
    isRequiredMessage: "Is required",
    notNumericMessage: "Not numeric",
    debounceTime: 350,
  });

  const fmtSel = useAmountFormatSelector({
    selectedUnit: state.selectedUnit,
    selectedDecimalCount: state.selectedDecimalCount,
    onFormatChanged: (selectedUnit: Unit.Unit<unknown>, selectedDecimalCount: number) =>
      setState({ ...state, selectedUnit, selectedDecimalCount }),
    onFormatCleared: () =>
      setState({
        ...state,
        selectedUnit: BaseUnits.Meter,
        selectedDecimalCount: 2,
      }),
    unitsFormat: unitsFormat,
    units: units,
  });

  return (
    <div>
      <div>Amount: {Amount.toString(state.amount)}</div>
      <div>AmountFormatSelector:</div>
      <div>
        {/* AmountInput */}
        <input type="text" {...selA.getInputProps()} style={getDefaultAmountInputBoxStyle(selA)} />
        {/* AmountFormat */}
        <span {...fmtSel.getLabelProps()}>
          {fmtSel.isOpen ? (
            <>
              <select {...fmtSel.getUnitSelectProps()}>
                {fmtSel.unitItems.map((item, index) => (
                  <option {...fmtSel.getUnitItemProps(index)}> {item.label} </option>
                ))}
              </select>
              <select {...fmtSel.getPrecisionSelectProps()}>
                {fmtSel.precisionItems.map((item, index) => (
                  <option {...fmtSel.getPrecisionItemProps(index)}>{item.label}</option>
                ))}
              </select>
              {fmtSel.showClearButton && <button {...fmtSel.getClearButtonProps()}>Cancel</button>}
              <button {...fmtSel.getCancelButtonProps()}>Clear</button>
            </>
          ) : (
            fmtSel.label
          )}
        </span>
      </div>
    </div>
  );
}

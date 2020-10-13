import React, { useCallback, useState } from "react";
import {
  getDefaultAmountInputBoxStyle,
  useAmountFormatSelector,
  useAmountInputBox
} from "@promaster-sdk/react-property-selectors";
import { Unit, Amount, BaseUnits } from "uom";
import { action } from "@storybook/addon-actions";
import { merge } from "../utils";
import { units, unitsFormat } from "../units-map";

type State = {
  readonly selectedUnit: Unit.Unit<unknown>;
  readonly selectedDecimalCount: number;
  readonly amount: Amount.Amount<unknown>;
};

export function AmountFormatSelectorExample1Hooks(): React.ReactElement<{}> {
  const [state, setState] = useState<State>({
    amount: Amount.create(10.0, BaseUnits.Meter),
    selectedUnit: BaseUnits.Meter,
    selectedDecimalCount: 2
  });

  const onValueChange = useCallback(
    amount => {
      setState(merge(state, { amount }));
    },
    [state, setState]
  );

  const selA = useAmountInputBox({
    value: state.amount,
    inputUnit: state.selectedUnit,
    inputDecimalCount: state.selectedDecimalCount,
    onValueChange,
    readonly: false,
    errorMessage: "",
    isRequiredMessage: "Is required",
    notNumericMessage: "Not numeric",
    debounceTime: 350
  });

  const fmtSel = useAmountFormatSelector({
    selectedUnit: state.selectedUnit,
    selectedDecimalCount: state.selectedDecimalCount,
    onFormatChanged: (
      selectedUnit: Unit.Unit<unknown>,
      selectedDecimalCount: number
    ) => setState(merge(state, { selectedUnit, selectedDecimalCount })),
    onFormatCleared: () =>
      setState(
        merge(state, {
          selectedUnit: BaseUnits.Meter,
          selectedDecimalCount: 2
        })
      ),
    onFormatSelectorActiveChanged: action("Toggle format selector"),
    unitsFormat: unitsFormat,
    units: units
  });

  return (
    <div>
      <div>Amount: {Amount.toString(state.amount)}</div>
      <div>AmountFormatSelector:</div>
      <div>
        {/* AmountInput */}
        <input
          {...selA.getInputProps()}
          style={getDefaultAmountInputBoxStyle(selA)}
        />
        {/* AmountFormat */}
        <span {...fmtSel.getWrapperProps()}>
          {fmtSel.active ? (
            <>
              <select {...fmtSel.getUnitSelectorProps()}>
                {fmtSel.unitSelectorOptions.map(o => (
                  <option {...o.getOptionProps()}> {o.label} </option>
                ))}
              </select>
              <select {...fmtSel.getPrecisionSelectorProps()}>
                {fmtSel.precisionSelectorOptions.map(o => (
                  <option {...o.getOptionProps()}>{o.label}</option>
                ))}
              </select>
              {fmtSel.showClearButton && (
                <button {...fmtSel.getClearButtonProps()}>Cancel</button>
              )}
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

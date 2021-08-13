import { Meta } from "@storybook/react";
import React, { useCallback, useState } from "react";
import { Amount, BaseUnits } from "uom";
import {
  getDefaultAmountInputBoxStyle,
  SelectableUnit,
  useAmountFormatSelector,
  useAmountInputBox,
} from "../../amount";
import { units } from "../units-map";

type State = {
  readonly selectedUnitIndex: number;
  readonly selectedDecimalCountIndex: number;
  readonly amount: Amount.Amount<unknown>;
};

export function Example1(): React.ReactElement<{}> {
  const selectableUnits: ReadonlyArray<SelectableUnit> = [
    { unit: units.Meter, label: "m", selectableDecimalCounts: [1, 2, 3] },
    { unit: units.CentiMeter, label: "cm", selectableDecimalCounts: [1, 2, 3] },
    { unit: units.Millimeter, label: "mm", selectableDecimalCounts: [1, 2, 3] },
  ];

  const [state, setState] = useState<State>({
    amount: Amount.create(10.0, BaseUnits.Meter),
    selectedUnitIndex: 0,
    selectedDecimalCountIndex: 0,
  });

  const onValueChange = useCallback(
    (amount) => {
      setState({ ...state, amount });
    },
    [state, setState]
  );

  const selA = useAmountInputBox({
    value: state.amount,
    inputUnit: selectableUnits[state.selectedUnitIndex].unit,
    inputDecimalCount:
      selectableUnits[state.selectedUnitIndex].selectableDecimalCounts[state.selectedDecimalCountIndex],
    onValueChange,
    readOnly: false,
    errorMessage: "",
    isRequiredMessage: "Is required",
    notNumericMessage: "Not numeric",
    debounceTime: 350,
  });

  const fmtSel = useAmountFormatSelector({
    getSelectableUnits: () => selectableUnits,
    selectedUnitIndex: state.selectedUnitIndex,
    selectedDecimalCountIndex: state.selectedDecimalCountIndex,
    onFormatChanged: (selectedUnit: SelectableUnit, selectedDecimalCount: number) =>
      setState({
        ...state,
        selectedUnitIndex: selectableUnits.indexOf(selectedUnit),
        selectedDecimalCountIndex: selectedUnit.selectableDecimalCounts.indexOf(selectedDecimalCount),
      }),
    onFormatCleared: () =>
      setState({
        ...state,
        selectedUnitIndex: 0,
        selectedDecimalCountIndex: 0,
      }),
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
              <select {...fmtSel.getDecimalCountSelectProps()}>
                {fmtSel.decimalCountItems.map((item, index) => (
                  <option {...fmtSel.getDecimalCountItemProps(index)}>{item.label}</option>
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

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "HOOKS/Amount Format Selector",
} as Meta;

import { Meta } from "@storybook/react";
import React, { useCallback, useState } from "react";
import { Amount, BaseUnits } from "uom";
import {
  formatsArrayToZipList,
  getDefaultAmountInputBoxStyle,
  SelectableFormat,
  UnitLabels,
  useAmountFormatSelector,
  useAmountInputBox,
} from "../../amount";
import { units } from "../units-map";

type StateX = {
  readonly selectedFormat: SelectableFormat;
  readonly amount: Amount.Amount<unknown>;
};

export function Example1(): React.ReactElement<{}> {
  const selectableFormats: ReadonlyArray<SelectableFormat> = [
    { unit: units.Meter, decimalCount: 1 },
    { unit: units.Meter, decimalCount: 2 },
    { unit: units.Meter, decimalCount: 3 },
    { unit: units.CentiMeter, decimalCount: 1 },
    { unit: units.CentiMeter, decimalCount: 2 },
    { unit: units.Millimeter, decimalCount: 1 },
  ];

  const unitLabels: UnitLabels = {
    Meter: "m",
    CentiMeter: "cm",
    Millimeter: "mm",
  };

  const test: StateX = {
    selectedFormat: { unit: units.Meter, decimalCount: 1 },
    amount: Amount.create(10.0, BaseUnits.Meter),
  };

  const [state, setState] = useState<StateX>(test);

  const onValueChange = useCallback(
    (amount) => {
      setState({ ...state, amount });
    },
    [state, setState]
  );

  console.log("test -> ", test);
  console.log("state -> ", state);

  const selA = useAmountInputBox({
    value: state.amount,
    inputUnit: state.selectedFormat.unit,
    inputDecimalCount: state.selectedFormat.decimalCount,
    onValueChange,
    readOnly: false,
    errorMessage: "",
    isRequiredMessage: "Is required",
    notNumericMessage: "Not numeric",
    debounceTime: 350,
  });

  const fmtSel = useAmountFormatSelector({
    getSelectableFormats: () => formatsArrayToZipList(selectableFormats, state.selectedFormat),
    onFormatChanged: (format: SelectableFormat) => setState({ ...state, selectedFormat: format }),
    onFormatCleared: () => setState({ ...state, selectedFormat: { unit: units.Meter, decimalCount: 1 } }),

    unitLabels: unitLabels,
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
              {fmtSel.showClearButton && <button {...fmtSel.getCancelButtonProps()}>Cancel</button>}
              <button {...fmtSel.getClearButtonProps()}>Clear</button>
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

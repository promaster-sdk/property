/* eslint-disable functional/no-this-expression */
/*
 UI to select a unit and a number of decimals independently of each other
 */
import React, { useState } from "react";
import { Unit, Serialize, Format, UnitFormat } from "uom";

export type UseAmountFormatSelectorOnFormatChanged = (
  unit: Unit.Unit<unknown>,
  decimalCount: number
) => void;
export type UseAmountFormatSelectorOnFormatCleared = () => void;
export type UseAmountFormatSelectorOnFormatSelectorToggled = (
  active: boolean
) => void;

export type UseAmountFormatSelectorParams = {
  readonly key?: string;
  readonly selectedUnit: Unit.Unit<unknown>;
  readonly selectedDecimalCount: number;
  readonly onFormatChanged?: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared?: UseAmountFormatSelectorOnFormatCleared;
  readonly onFormatSelectorActiveChanged?: UseAmountFormatSelectorOnFormatSelectorToggled;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  readonly units: {
    readonly [key: string]: Unit.Unit<unknown>;
  };
};

export type UseAmountFormatSelector = {
  readonly active: boolean;
  readonly label: string;
  readonly getWrapperProps: () => React.HTMLAttributes<HTMLSpanElement>;
  readonly getUnitSelectorProps: () => React.SelectHTMLAttributes<
    HTMLSelectElement
  >;
  readonly unitSelectorOptions: ReadonlyArray<UnitSelectorOption>;
  readonly getPrecisionSelectorProps: () => React.SelectHTMLAttributes<
    HTMLSelectElement
  >;
  readonly precisionSelectorOptions: ReadonlyArray<PrecisionSelectorOption>;
  readonly showClearButton: boolean;
  readonly getClearButtonProps: () => React.ButtonHTMLAttributes<
    HTMLButtonElement
  >;
  readonly getCancelButtonProps: () => React.ButtonHTMLAttributes<
    HTMLButtonElement
  >;
};

export type PrecisionSelectorOption = {
  readonly label: string;
  readonly getOptionProps: () => React.OptionHTMLAttributes<HTMLOptionElement>;
};

export type UnitSelectorOption = {
  readonly label: string;
  readonly getOptionProps: () => React.OptionHTMLAttributes<HTMLOptionElement>;
};

type State = {
  readonly active: boolean;
};

export function useAmountFormatSelector(
  params: UseAmountFormatSelectorParams
): UseAmountFormatSelector {
  const {
    selectedUnit,
    selectedDecimalCount,
    onFormatChanged,
    onFormatCleared,
    unitsFormat,
    units
  } = params;

  const [state, setState] = useState<State>({ active: false });

  // If there is no handler for onFormatChanged then the user should not be able to change the format
  if (!state.active || !onFormatChanged) {
    const format = Format.getUnitFormat(selectedUnit, unitsFormat);

    return {
      active: state.active,
      label: format ? format.label : "",
      getWrapperProps: () => ({
        onClick: () => setState({ active: true })
      }),
      getUnitSelectorProps: () => ({}),
      unitSelectorOptions: [],
      getPrecisionSelectorProps: () => ({}),
      precisionSelectorOptions: [],
      showClearButton: false,
      getClearButtonProps: () => ({}),
      getCancelButtonProps: () => ({})
    };
  }

  // Get a list of all units within the quantity
  const quantityUnits = Format.getUnitsForQuantity(
    selectedUnit.quantity as string,
    unitsFormat,
    units
  );
  const unitNames = quantityUnits.map(u => Serialize.unitToString(u));
  const selectedUnitName = Serialize.unitToString(selectedUnit);

  const decimalCounts = [0, 1, 2, 3, 4, 5];
  if (decimalCounts.indexOf(selectedDecimalCount) === -1) {
    decimalCounts.push(selectedDecimalCount);
  }

  return {
    active: state.active,
    label: selectedUnitName,
    getWrapperProps: () => ({}),
    getUnitSelectorProps: () => ({
      value: selectedUnitName,
      onChange: e => {
        setState({ active: false });
        _onUnitChange(e, quantityUnits, selectedDecimalCount, onFormatChanged);
      }
    }),
    unitSelectorOptions: quantityUnits.map((u, index) => {
      const format = Format.getUnitFormat(u, unitsFormat);
      return {
        label: format ? format.label : "",
        getOptionProps: () => ({
          key: unitNames[index],
          value: unitNames[index]
        })
      };
    }),
    getPrecisionSelectorProps: () => ({
      value: selectedDecimalCount.toString(),
      onChange: e => {
        setState({ active: false });
        _onDecimalCountChange(e, selectedUnit, onFormatChanged);
      }
    }),
    precisionSelectorOptions: decimalCounts.map(dc => ({
      label: dc.toString(),
      getOptionProps: () => ({
        key: dc.toString(),
        value: dc.toString()
      })
    })),
    showClearButton: !!onFormatCleared,
    getClearButtonProps: () => ({
      onClick: () => {
        setState({ active: false });
        if (onFormatCleared) {
          onFormatCleared();
        }
      }
    }),
    getCancelButtonProps: () => ({
      onClick: () => setState({ active: false })
    })
  };
}

function _onDecimalCountChange(
  e: React.FormEvent<HTMLSelectElement>,
  selectedUnit: Unit.Unit<unknown>,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const selectedIndex = e.currentTarget.selectedIndex;
  const selectedDecimalCount = selectedIndex;
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

function _onUnitChange(
  e: React.FormEvent<HTMLSelectElement>,
  units: Array<Unit.Unit<unknown>>,
  selectedDecimalCount: number,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const selectedIndex = e.currentTarget.selectedIndex;
  const selectedUnit = units[selectedIndex];
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

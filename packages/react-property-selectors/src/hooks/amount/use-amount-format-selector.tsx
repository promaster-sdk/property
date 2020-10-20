/* eslint-disable functional/no-this-expression */
/*
 UI to select a unit and a number of decimals independently of each other
 */
import React, { useState } from "react";
import { Unit, Serialize, UnitFormat, UnitMap } from "uom";

export type UseAmountFormatSelectorOnFormatChanged = (unit: Unit.Unit<unknown>, decimalCount: number) => void;
export type UseAmountFormatSelectorOnFormatCleared = () => void;

export type UseAmountFormatSelectorOptions = {
  readonly key?: string;
  readonly selectedUnit: Unit.Unit<unknown>;
  readonly selectedDecimalCount: number;
  readonly onFormatChanged?: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared?: UseAmountFormatSelectorOnFormatCleared;
  readonly unitsFormat: UnitFormat.UnitFormatMap;
  readonly units: UnitMap.UnitMap;
};

export type UseAmountFormatSelector = {
  readonly label: string;
  readonly isOpen: boolean;
  readonly getLabelProps: () => React.HTMLAttributes<HTMLSpanElement>;
  readonly getUnitSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly unitSelectorOptions: ReadonlyArray<UnitSelectorOption>;
  readonly getPrecisionSelectProps: () => React.SelectHTMLAttributes<HTMLSelectElement>;
  readonly precisionSelectorOptions: ReadonlyArray<PrecisionSelectorOption>;
  readonly showClearButton: boolean;
  readonly getClearButtonProps: () => React.ButtonHTMLAttributes<HTMLButtonElement>;
  readonly getCancelButtonProps: () => React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export type PrecisionSelectorOption = {
  readonly label: string;
  readonly getOptionProps: () => React.OptionHTMLAttributes<HTMLOptionElement>;
};

export type UnitSelectorOption = {
  readonly label: string;
  readonly getOptionProps: () => React.OptionHTMLAttributes<HTMLOptionElement>;
};

export function useAmountFormatSelector(options: UseAmountFormatSelectorOptions): UseAmountFormatSelector {
  const { selectedUnit, selectedDecimalCount, onFormatChanged, onFormatCleared, unitsFormat, units } = options;

  const [isOpen, setIsOpen] = useState(false);

  // If there is no handler for onFormatChanged then the user should not be able to change the format
  if (!isOpen || !onFormatChanged) {
    const format = UnitFormat.getUnitFormat(selectedUnit, unitsFormat);

    return {
      isOpen,
      label: format ? format.label : "",
      getLabelProps: () => ({
        onClick: () => setIsOpen(true),
      }),
      getUnitSelectProps: () => ({}),
      unitSelectorOptions: [],
      getPrecisionSelectProps: () => ({}),
      precisionSelectorOptions: [],
      showClearButton: false,
      getClearButtonProps: () => ({}),
      getCancelButtonProps: () => ({}),
    };
  }

  // Get a list of all units within the quantity
  const quantityUnits = UnitMap.getUnitsForQuantity(selectedUnit.quantity as string, units);
  const unitNames = quantityUnits.map((u) => Serialize.unitToString(u));
  const selectedUnitName = Serialize.unitToString(selectedUnit);

  const decimalCounts = [0, 1, 2, 3, 4, 5];
  if (decimalCounts.indexOf(selectedDecimalCount) === -1) {
    decimalCounts.push(selectedDecimalCount);
  }

  return {
    isOpen,
    label: selectedUnitName,
    getLabelProps: () => ({}),
    getUnitSelectProps: () => ({
      value: selectedUnitName,
      onChange: (e) => {
        setIsOpen(false);
        _onUnitChange(e, quantityUnits, selectedDecimalCount, onFormatChanged);
      },
    }),
    unitSelectorOptions: quantityUnits.map((u, index) => {
      const format = UnitFormat.getUnitFormat(u, unitsFormat);
      return {
        label: format ? format.label : "",
        getOptionProps: () => ({
          key: unitNames[index],
          value: unitNames[index],
        }),
      };
    }),
    getPrecisionSelectProps: () => ({
      value: selectedDecimalCount.toString(),
      onChange: (e) => {
        setIsOpen(false);
        _onDecimalCountChange(e, selectedUnit, onFormatChanged);
      },
    }),
    precisionSelectorOptions: decimalCounts.map((dc) => ({
      label: dc.toString(),
      getOptionProps: () => ({
        key: dc.toString(),
        value: dc.toString(),
      }),
    })),
    showClearButton: !!onFormatCleared,
    getClearButtonProps: () => ({
      onClick: () => {
        setIsOpen(false);
        if (onFormatCleared) {
          onFormatCleared();
        }
      },
    }),
    getCancelButtonProps: () => ({
      onClick: () => setIsOpen(false),
    }),
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
  units: ReadonlyArray<Unit.Unit<unknown>>,
  selectedDecimalCount: number,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const selectedIndex = e.currentTarget.selectedIndex;
  const selectedUnit = units[selectedIndex];
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

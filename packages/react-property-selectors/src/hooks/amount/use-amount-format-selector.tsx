/* eslint-disable functional/no-this-expression */
/*
 UI to select a unit and a number of decimals independently of each other
 */
import React, { useState } from "react";
import { Unit, Serialize, UnitFormat, UnitMap } from "uom";

export type UseAmountFormatSelectorOnFormatChanged = (unit: Unit.Unit<unknown>, decimalCount: number) => void;
export type UseAmountFormatSelectorOnFormatCleared = () => void;

export type UseAmountFormatSelectorOptions = {
  readonly selectedUnit: Unit.Unit<unknown>;
  readonly selectedDecimalCount: number;
  readonly onFormatChanged?: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared?: UseAmountFormatSelectorOnFormatCleared;
  readonly unitsFormat: UnitFormat.UnitFormatMap;
  readonly units: UnitMap.UnitMap;
};

export type UnitSelectProps = {
  readonly onChange: React.ChangeEventHandler<{ readonly value: string }>;
  readonly value: string;
};

export type PrecisionSelectProps = {
  readonly onChange: React.ChangeEventHandler<{ readonly value: string }>;
  readonly value: string;
};

export type LabelProps = { readonly onClick: React.MouseEventHandler<{}> };
export type ClearButtonProps = { readonly onClick: React.MouseEventHandler<{}> };
export type CancelButtonProps = { readonly onClick: React.MouseEventHandler<{}> };

export type UseAmountFormatSelector = {
  readonly label: string;
  readonly isOpen: boolean;
  readonly showClearButton: boolean;
  // Items
  readonly unitItems: ReadonlyArray<UnitItem>;
  readonly precisionItems: ReadonlyArray<PrecisionItem>;
  // PropGetters
  readonly getUnitItemProps: (index: number) => UnitItemProps;
  readonly getPrecisionItemProps: (index: number) => PrecisionItemProps;
  readonly getLabelProps: () => LabelProps;
  readonly getUnitSelectProps: () => UnitSelectProps;
  readonly getPrecisionSelectProps: () => PrecisionSelectProps;
  readonly getClearButtonProps: () => ClearButtonProps;
  readonly getCancelButtonProps: () => CancelButtonProps;
};

export type UnitItemProps = {
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly value: string | Array<string> | number;
};

export type PrecisionItemProps = {
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly value: string | Array<string> | number;
};

export type PrecisionItem = {
  readonly label: string;
};

export type UnitItem = {
  readonly label: string;
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
      showClearButton: false,
      getUnitItemProps: () => ({ value: "" }),
      getPrecisionItemProps: () => ({ value: "" }),
      unitItems: [],
      precisionItems: [],
      getLabelProps: () => ({
        onClick: () => setIsOpen(true),
      }),
      getUnitSelectProps: () => ({ onChange: () => ({}), value: "" }),
      getPrecisionSelectProps: () => ({ onChange: () => ({}), value: "" }),
      getClearButtonProps: () => ({ onClick: () => ({}) }),
      getCancelButtonProps: () => ({ onClick: () => ({}) }),
    };
  }

  // Get a list of all units within the quantity
  const quantityUnits = UnitMap.getUnitsForQuantity(selectedUnit.quantity as string, units);
  const selectedUnitName = Serialize.unitToString(selectedUnit);

  const unitItemValues = quantityUnits.map((u) => Serialize.unitToString(u));
  const unitItems = quantityUnits.map((u) => {
    const format = UnitFormat.getUnitFormat(u, unitsFormat);
    return {
      label: format ? format.label : "",
    };
  });
  const precisionItemValues = [0, 1, 2, 3, 4, 5];
  if (precisionItemValues.indexOf(selectedDecimalCount) === -1) {
    precisionItemValues.push(selectedDecimalCount);
  }
  const precisionItems = precisionItemValues.map((dc) => ({
    label: dc.toString(),
  }));

  return {
    isOpen,
    label: selectedUnitName,
    showClearButton: !!onFormatCleared,
    unitItems,
    precisionItems,
    getUnitItemProps: (index) => {
      return {
        value: unitItemValues[index],
      };
    },
    getPrecisionItemProps: (index) => {
      const dc = precisionItemValues[index];
      return {
        value: dc.toString(),
      };
    },
    getLabelProps: () => ({ onClick: () => ({}) }),
    getUnitSelectProps: () => ({
      value: selectedUnitName,
      onChange: (e) => {
        setIsOpen(false);
        _onUnitChange(e, quantityUnits, unitItemValues, selectedDecimalCount, onFormatChanged);
      },
    }),
    getPrecisionSelectProps: () => ({
      value: selectedDecimalCount.toString(),
      onChange: (e) => {
        setIsOpen(false);
        _onDecimalCountChange(e, selectedUnit, onFormatChanged);
      },
    }),
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
  e: React.ChangeEvent<{ readonly value: string }>,
  selectedUnit: Unit.Unit<unknown>,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  onFormatChanged(selectedUnit, Number.parseInt(e.target.value, 10));
}

function _onUnitChange(
  e: React.ChangeEvent<{ readonly value: string }>,
  units: ReadonlyArray<Unit.Unit<unknown>>,
  unitItemValues: ReadonlyArray<string>,
  selectedDecimalCount: number,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const selectedIndex = unitItemValues.indexOf(e.target.value);
  const selectedUnit = units[selectedIndex];
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

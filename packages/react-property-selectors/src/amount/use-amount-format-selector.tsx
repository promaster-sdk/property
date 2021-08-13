/* eslint-disable functional/no-this-expression */
/*
 UI to select a unit and a number of decimals independently of each other
 */
import React, { useState } from "react";
import { Unit, Serialize } from "uom";

export type UseAmountFormatSelectorOnFormatChanged = (unit: SelectableUnit, decimalCount: number) => void;
export type UseAmountFormatSelectorOnFormatCleared = () => void;
export type SelectableUnit = {
  readonly label: string;
  readonly unit: Unit.Unit<unknown>;
  readonly selectableDecimalCounts: ReadonlyArray<number>;
};
export type GetSelectableUnits = () => ReadonlyArray<SelectableUnit>;

export type UseAmountFormatSelectorOptions = {
  readonly onFormatChanged?: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared?: UseAmountFormatSelectorOnFormatCleared;
  readonly getSelectableUnits: GetSelectableUnits;
  readonly selectedUnitIndex: number;
  readonly selectedDecimalCountIndex: number;
};

export type UnitSelectProps = {
  readonly onChange: React.ChangeEventHandler<{ readonly value: string }>;
  readonly value: string;
};

export type DecimalCountSelectProps = {
  readonly onChange: React.ChangeEventHandler<{ readonly value: string }>;
  readonly value: string;
};

export type LabelProps = { readonly onClick: React.MouseEventHandler<{}> };
export type ClearButtonProps = { readonly onClick: React.MouseEventHandler<{}> };
export type CancelButtonProps = { readonly onClick: React.MouseEventHandler<{}> };

export type UseAmountFormatSelectorHook = {
  readonly label: string;
  readonly isOpen: boolean;
  readonly showClearButton: boolean;
  // Items
  readonly unitItems: ReadonlyArray<UnitItem>;
  readonly decimalCountItems: ReadonlyArray<DecimalCountsItem>;
  // PropGetters
  readonly getUnitItemProps: (index: number) => UnitItemProps;
  readonly getDecimalCountItemProps: (index: number) => DecimalCountsItemProps;
  readonly getLabelProps: () => LabelProps;
  readonly getUnitSelectProps: () => UnitSelectProps;
  readonly getDecimalCountSelectProps: () => DecimalCountSelectProps;
  readonly getClearButtonProps: () => ClearButtonProps;
  readonly getCancelButtonProps: () => CancelButtonProps;
};

export type UnitItemProps = {
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly value: string | Array<string> | number;
};

export type DecimalCountsItemProps = {
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly value: string | Array<string> | number;
};

export type DecimalCountsItem = {
  readonly label: string;
};

export type UnitItem = {
  readonly label: string;
};

export function useAmountFormatSelector(options: UseAmountFormatSelectorOptions): UseAmountFormatSelectorHook {
  const {
    selectedUnitIndex,
    selectedDecimalCountIndex,
    onFormatChanged,
    onFormatCleared,
    getSelectableUnits,
  } = options;

  const [isOpen, setIsOpen] = useState(false);

  const selectableUnits = getSelectableUnits();
  const selectedUnit = selectableUnits[selectedUnitIndex];
  const selectedDecimalCounts = selectedUnit.selectableDecimalCounts[selectedDecimalCountIndex];

  // If there is no handler for onFormatChanged then the user should not be able to change the format
  if (!isOpen || !onFormatChanged) {
    // const format = UnitFormat.getUnitFormat(selectedUnit, selectedSelectableUnit?.unit ?? selectableUnits[0].unit);
    return {
      isOpen,
      label: selectedUnit?.label ?? "",
      showClearButton: false,
      getUnitItemProps: () => ({ value: "" }),
      getDecimalCountItemProps: () => ({ value: "" }),
      unitItems: [],
      decimalCountItems: [],
      getLabelProps: () => ({
        onClick: () => setIsOpen(true),
      }),
      getUnitSelectProps: () => ({ onChange: () => ({}), value: "" }),
      getDecimalCountSelectProps: () => ({ onChange: () => ({}), value: "" }),
      getClearButtonProps: () => ({ onClick: () => ({}) }),
      getCancelButtonProps: () => ({ onClick: () => ({}) }),
    };
  }

  // Build units list
  const unitItemValues = selectableUnits.map((su) => Serialize.unitToString(su.unit));
  const unitItems = selectableUnits.map((su) => {
    return { label: su.label };
  });

  // Build decimal places list
  const decimalCountsItemValues = selectedUnit.selectableDecimalCounts;
  const decimalCountItems = decimalCountsItemValues.map((p) => ({ label: p.toString() }));

  return {
    isOpen,
    label: selectedUnit.label,
    showClearButton: !!onFormatCleared,
    unitItems,
    decimalCountItems,
    getUnitItemProps: (index) => {
      return {
        value: unitItemValues[index],
      };
    },
    getDecimalCountItemProps: (index) => {
      const dc = decimalCountsItemValues[index];
      return {
        value: dc.toString(),
      };
    },
    getLabelProps: () => ({ onClick: () => ({}) }),
    getUnitSelectProps: () => ({
      value: Serialize.unitToString(selectedUnit.unit),
      onChange: (e) => {
        setIsOpen(false);
        _onUnitChange(e, selectableUnits, unitItemValues, selectedDecimalCounts, onFormatChanged);
      },
    }),
    getDecimalCountSelectProps: () => ({
      value: selectedDecimalCounts.toString(),
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
  selectedUnit: SelectableUnit,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  onFormatChanged(selectedUnit, Number.parseInt(e.target.value, 10));
}

function _onUnitChange(
  e: React.ChangeEvent<{ readonly value: string }>,
  units: ReadonlyArray<SelectableUnit>,
  unitItemValues: ReadonlyArray<string>,
  selectedDecimalCount: number,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const selectedIndex = unitItemValues.indexOf(e.target.value);
  const selectedUnit = units[selectedIndex];
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

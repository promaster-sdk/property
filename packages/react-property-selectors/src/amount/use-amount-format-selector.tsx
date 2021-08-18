/* eslint-disable functional/no-this-expression */
/*
 UI to select a unit and a number of decimals independently of each other
 */
import React, { useState } from "react";
import { Unit } from "uom";
import * as ZipList from "./zip-list";

export type UseAmountFormatSelectorOnFormatChanged = (format: SelectableFormat) => void;
export type UseAmountFormatSelectorOnFormatCleared = () => void;

export type SelectableFormat = {
  readonly unit: Unit.Unit<unknown>;
  readonly decimalCount: number;
};

export type GetSelectableFormats = () => ZipList.ZipList<SelectableFormat>;

export type UseAmountFormatSelectorOptions = {
  readonly onFormatChanged?: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared?: UseAmountFormatSelectorOnFormatCleared;
  readonly getSelectableFormats: GetSelectableFormats;
  readonly unitLabels: UnitLabels;
};

export function formatsArrayToZipList(
  arr: ReadonlyArray<SelectableFormat>,
  current: SelectableFormat
): ZipList.ZipList<SelectableFormat> {
  return ZipList.fromArray<SelectableFormat>(arr, current, (a: SelectableFormat, b: SelectableFormat) => {
    return a.unit === b.unit && a.decimalCount === b.decimalCount;
  });
}

export type UnitLabels = {
  readonly [unitName: string]: string;
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
  readonly isOpen: boolean;
  readonly showClearButton: boolean;
  // Items
  readonly unitItems: ReadonlyArray<UnitItem>;
  readonly selectedUnitItem: UnitItem;
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
  readonly value: string;
};

export type UnitItem = {
  readonly label: string;
  readonly unit: Unit.Unit<unknown>;
  readonly value: string;
};

export function useAmountFormatSelector(options: UseAmountFormatSelectorOptions): UseAmountFormatSelectorHook {
  const { onFormatChanged, onFormatCleared, getSelectableFormats, unitLabels } = options;

  const [isOpen, setIsOpen] = useState(false);

  const selectableFormatsZip = getSelectableFormats();

  // If there is no handler for onFormatChanged then the user should not be able to change the format
  if (!isOpen || !onFormatChanged) {
    return {
      isOpen,
      showClearButton: false,
      unitItems: [],
      selectedUnitItem: {
        label: unitLabels[selectableFormatsZip.current.unit.name] ?? selectableFormatsZip.current.unit.name,
        unit: selectableFormatsZip.current.unit,
        value: selectableFormatsZip.current.unit.name,
      },
      decimalCountItems: [],
      getUnitItemProps: () => ({ value: "" }),
      getDecimalCountItemProps: () => ({ value: "" }),
      getLabelProps: () => ({
        onClick: () => setIsOpen(true),
      }),
      getUnitSelectProps: () => ({ onChange: () => ({}), value: "" }),
      getDecimalCountSelectProps: () => ({ onChange: () => ({}), value: "" }),
      getClearButtonProps: () => ({ onClick: () => ({}) }),
      getCancelButtonProps: () => ({ onClick: () => ({}) }),
    };
  }

  const selectableFormats = ZipList.toArray(selectableFormatsZip);

  // Build unit item list
  const unitItems = Array.from(new Set(selectableFormats.map((su) => su.unit))).map((u) => ({
    unit: u,
    label: unitLabels[u.name] ?? u.name,
    value: u.name,
  }));

  // Build decimal count item list
  const decimalCountItems = selectableFormats
    .filter((su) => su.unit === selectableFormatsZip.current.unit)
    .map((dv) => ({ label: dv.decimalCount.toString(), value: dv.decimalCount.toString() }));

  // Get selected unit item
  const selectedUnitItem = unitItems.find((ui) => ui.unit === selectableFormatsZip.current.unit)!;

  return {
    isOpen,
    showClearButton: !!onFormatCleared,
    unitItems,
    selectedUnitItem: unitItems.find((ui) => ui.unit === selectableFormatsZip.current.unit)!,
    decimalCountItems: decimalCountItems,
    getUnitItemProps: (index) => {
      return {
        value: unitItems[index].value,
      };
    },
    getDecimalCountItemProps: (index) => {
      return {
        value: decimalCountItems[index].value,
      };
    },
    getLabelProps: () => ({ onClick: () => ({}) }),
    getUnitSelectProps: () => ({
      value: selectedUnitItem.value,
      onChange: (e) => {
        setIsOpen(false);
        onUnitItemChange(e.target.value, unitItems, selectableFormatsZip.current, selectableFormats, onFormatChanged);
      },
    }),
    getDecimalCountSelectProps: () => ({
      value: selectableFormatsZip.current.decimalCount.toString(),
      onChange: (e) => {
        setIsOpen(false);
        onUnitDecimalCountChange(e.target.value, selectableFormatsZip.current, selectableFormats, onFormatChanged);
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

function onUnitItemChange(
  newItemValue: string,
  unitItems: ReadonlyArray<UnitItem>,
  currentFormat: SelectableFormat,
  formats: ReadonlyArray<SelectableFormat>,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const newUnitItem = unitItems.find((ui) => ui.value === newItemValue)!;
  const possibleFormats = formats.filter((f) => f.unit === newUnitItem.unit);

  const possibleDecimalCounts = possibleFormats.map((p) => p.decimalCount);
  const closestIndex = findClosestIndex(possibleDecimalCounts, currentFormat.decimalCount);
  const newFormat = possibleFormats[closestIndex];

  onFormatChanged(newFormat);
}

function onUnitDecimalCountChange(
  newDecimal: string,
  current: SelectableFormat,
  formats: ReadonlyArray<SelectableFormat>,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const possibleUnitFormats = formats.filter((f) => f.unit.name === current.unit.name);
  const selectedFormat = possibleUnitFormats.find((f) => f.decimalCount.toString() === newDecimal);

  if (selectedFormat) {
    onFormatChanged(selectedFormat);
  } else if (possibleUnitFormats.length > 0) {
    onFormatChanged(possibleUnitFormats[0]);
  } else {
    // TODO Could not find format"
  }
}

function findClosestIndex(numbers: ReadonlyArray<number>, n: number): number {
  const deltas = numbers.map((x) => Math.abs(x - n));
  const minValue = Math.min(...deltas);
  const closestIndex = deltas.findIndex((d) => d === minValue);
  return closestIndex;
}

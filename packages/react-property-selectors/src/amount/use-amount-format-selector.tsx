/* eslint-disable functional/no-this-expression */
/*
 UI to select a unit and a number of decimals independently of each other
 */
import React, { useState } from "react";
import { Unit, Serialize } from "uom";

export type UseAmountFormatSelectorOnFormatChanged = (format: SelectableFormat) => void;
export type UseAmountFormatSelectorOnFormatCleared = () => void;

export type SelectableFormat = {
  readonly unit: Unit.Unit<unknown>;
  readonly decimalCount: number;
};

export type GetSelectableFormats = () => ZipList<SelectableFormat>;

export type UseAmountFormatSelectorOptions = {
  readonly onFormatChanged?: UseAmountFormatSelectorOnFormatChanged;
  readonly onFormatCleared?: UseAmountFormatSelectorOnFormatCleared;
  readonly getSelectableFormats: GetSelectableFormats;
  readonly unitLabels: UnitLabels;
};

export type ZipList<T> = {
  readonly head: ReadonlyArray<T>;
  readonly current: T;
  readonly tail: ReadonlyArray<T>;
};

export function zipListToArray<T>(z: ZipList<T>): ReadonlyArray<T> {
  return [...z.head, z.current, ...z.tail];
}

export function arrayToZipList<T>(arr: ReadonlyArray<T>, current: T, compare: (a: T, b: T) => Boolean): ZipList<T> {
  if (arr.length < 0) {
    return {
      head: [],
      current: current,
      tail: [],
    };
  }

  const currentInArray = arr.find((f) => compare(f, current));
  if (!currentInArray) {
    return {
      head: arr,
      current: current,
      tail: [],
    };
  }

  const idx = arr.indexOf(currentInArray);

  return {
    head: arr.slice(0, idx),
    current: currentInArray,
    tail: arr.length < idx + 1 ? [] : arr.slice(idx + 1),
  };
}

export function formatsArrayToZipList(
  arr: ReadonlyArray<SelectableFormat>,
  current: SelectableFormat
): ZipList<SelectableFormat> {
  return arrayToZipList<SelectableFormat>(arr, current, (a: SelectableFormat, b: SelectableFormat) => {
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

type MinMaxFormatValue = { readonly val: number; readonly format: SelectableFormat };
type MinMaxFormats = { readonly min: MinMaxFormatValue; readonly max: MinMaxFormatValue };

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
  const { onFormatChanged, onFormatCleared, getSelectableFormats, unitLabels } = options;

  const [isOpen, setIsOpen] = useState(false);

  const selectableFormatsZip = getSelectableFormats();
  const selectableFormats = zipListToArray(selectableFormatsZip);
  const selectableUnits = Array.from(new Set(selectableFormats.map((su) => su.unit)));

  const selectedUnitLabel =
    unitLabels[selectableFormatsZip.current.unit.name] ?? selectableFormatsZip.current.unit.name;

  // If there is no handler for onFormatChanged then the user should not be able to change the format
  if (!isOpen || !onFormatChanged) {
    // const format = UnitFormat.getUnitFormat(selectedUnit, selectedSelectableUnit?.unit ?? selectableUnits[0].unit);
    return {
      isOpen,
      label: selectedUnitLabel, //selectedUnit?.label ?? "",
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
  const unitItemValues = selectableUnits.map((u) => Serialize.unitToString(u));
  const unitItems = selectableUnits.map((u) => unitItemValue(u, unitLabels));

  // Build decimal places list
  const decimalCountItemValues = selectableFormats
    .filter((su) => su.unit === selectableFormatsZip.current.unit)
    .map((su) => su.decimalCount);
  const decimalCountItems = decimalCountItemValues.map(decimalCountItemValue);

  return {
    isOpen,
    label: selectedUnitLabel,
    showClearButton: !!onFormatCleared,
    unitItems: unitItems,
    decimalCountItems: decimalCountItems,
    getUnitItemProps: (index) => {
      return {
        value: unitItemValues[index],
      };
    },
    getDecimalCountItemProps: (index) => {
      //    const dc = decimalCountItemValues[index];
      return {
        value: decimalCountItemValues[index],
      };
    },
    getLabelProps: () => ({ onClick: () => ({}) }),
    getUnitSelectProps: () => ({
      value: Serialize.unitToString(selectableFormatsZip.current.unit),
      onChange: (e) => {
        setIsOpen(false);
        onUnitFormatChange(e.target.value, selectableFormatsZip.current, selectableFormats, onFormatChanged);
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

function unitItemValue(unit: Unit.Unit<unknown>, unitLabels: UnitLabels): { readonly label: string } {
  return { label: unitLabels[unit.name] ?? unit.name };
}

function decimalCountItemValue(decimal: number): { readonly label: string } {
  return { label: decimal.toString() };
}

function onUnitFormatChange(
  newUnitName: string,
  current: SelectableFormat,
  formats: ReadonlyArray<SelectableFormat>,
  onFormatChanged: UseAmountFormatSelectorOnFormatChanged
): void {
  const possibleUnitFormats = formats.filter((f) => f.unit.name === newUnitName);
  const selectedFormat = possibleUnitFormats.find((f) => f.decimalCount === current.decimalCount);

  if (selectedFormat) {
    onFormatChanged(selectedFormat);
    return;
  }

  if (possibleUnitFormats.length > 0) {
    const bounds = possibleUnitFormats.reduce<MinMaxFormats>(
      (p, c) =>
        (p = {
          max: p.max.val < c.decimalCount ? { val: c.decimalCount, format: c } : p.max,
          min: p.min.val > c.decimalCount ? { val: c.decimalCount, format: c } : p.min,
        }),
      {
        max: { val: possibleUnitFormats[0].decimalCount, format: possibleUnitFormats[0] },
        min: { val: possibleUnitFormats[0].decimalCount, format: possibleUnitFormats[0] },
      }
    );

    if (current.decimalCount > bounds.max.val && bounds.max.format) {
      onFormatChanged(bounds.max.format);
      return;
    }

    if (current.decimalCount < bounds.min.val && bounds.min.format) {
      onFormatChanged(bounds.min.format);
      //return;
    }
  }

  // TODO : Could not find format
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

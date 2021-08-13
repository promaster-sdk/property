import React, { useCallback, useState } from "react";
import { Meta } from "@storybook/react";
import { UnitMap } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { units, unitsFormat } from "../units-map";
import { MyAmountSelector } from "../selector-ui/selector-ui";
import { SelectableUnit, UseAmountPropertySelectorOptions } from "../..";

const unitLookup: UnitMap.UnitLookup = (unitString) => (units as UnitMap.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly selectedUnitIndex: number;
  readonly selectedDecimalCountIndex: number;
}

const filterPrettyPrint = (propertyFilter: PropertyFilter.PropertyFilter): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.buildEnglishMessages(unitsFormat),
    2,
    " ",
    propertyFilter,
    unitsFormat,
    unitLookup
  );

const validationFilter = PropertyFilter.fromString("a<100:Meter", unitLookup)!;

export function Example1(): React.ReactElement<{}> {
  const selectableUnits: ReadonlyArray<SelectableUnit> = [
    { unit: units.Meter, label: "m", selectableDecimalCounts: [1, 2, 3] },
    { unit: units.CentiMeter, label: "cm", selectableDecimalCounts: [1, 2, 3] },
    { unit: units.Millimeter, label: "mm", selectableDecimalCounts: [1, 2, 3] },
  ];

  const [state, setState] = useState<State>({
    propertyValueSet: PropertyValueSet.fromString("a=10:Meter", unitLookup),
    selectedUnitIndex: 0,
    selectedDecimalCountIndex: 0,
  });

  const onValueChange = useCallback(
    (pv) =>
      setState({
        ...state,
        propertyValueSet: PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, state.propertyValueSet),
      }),
    [state, setState]
  );

  const onFormatChanged = useCallback(
    (selectedUnit, selectedDecimalCount) =>
      setState({
        ...state,
        selectedUnitIndex: selectableUnits.indexOf(selectedUnit),
        selectedDecimalCountIndex: selectedUnit.selectableDecimalCounts.indexOf(selectedDecimalCount),
      }),
    [state, setState]
  );

  const onFormatCleared = useCallback(
    () =>
      setState({
        ...state,
        selectedUnitIndex: 0,
        selectedDecimalCountIndex: 0,
      }),
    [state, setState]
  );

  const selOptions: UseAmountPropertySelectorOptions = {
    propertyName: "a",
    propertyValueSet: state.propertyValueSet,
    onValueChange,
    filterPrettyPrint: filterPrettyPrint,
    validationFilter: validationFilter,
    readOnly: false,
    isRequiredMessage: "Is required",
    notNumericMessage: "Not numeric",
    onFormatChanged: onFormatChanged,
    onFormatCleared: onFormatCleared,
    // inputUnit: state.selectedUnit,
    // inputDecimalCount: state.selectedDecimalCount,
    // unitsFormat: unitsFormat,
    // units: units,
    getSelectableUnits: () => selectableUnits,
    selectedUnitIndex: state.selectedUnitIndex,
    selectedDecimalCountIndex: state.selectedDecimalCountIndex,
  };

  return (
    <div>
      <div>AmountPropertySelector X:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(state.propertyValueSet)}</div>
      <MyAmountSelector {...selOptions} />
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "HOOKS/Amount Property Selector",
} as Meta;

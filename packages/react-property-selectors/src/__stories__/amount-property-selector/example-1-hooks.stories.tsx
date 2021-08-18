import React, { useCallback, useState } from "react";
import { Meta } from "@storybook/react";
import { UnitMap } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { units, unitsFormat } from "../units-map";
import { MyAmountSelector } from "../selector-ui/selector-ui";
import { UseAmountFormatSelectorOnFormatChanged, SelectableFormat, UseAmountPropertySelectorOptions } from "../..";
import { formatsArrayToZipList, UnitLabels } from "../../amount";

const unitLookup: UnitMap.UnitLookup = (unitString) => (units as UnitMap.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly selectedFormat: SelectableFormat;
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
  const selectableFormats: ReadonlyArray<SelectableFormat> = [
    { unit: units.Meter, decimalCount: 0 },
    { unit: units.Meter, decimalCount: 1 },
    { unit: units.Meter, decimalCount: 2 },
    { unit: units.Meter, decimalCount: 3 },
    { unit: units.CentiMeter, decimalCount: 0 },
    { unit: units.CentiMeter, decimalCount: 1 },
    { unit: units.Millimeter, decimalCount: 0 },
  ];

  const unitLabels: UnitLabels = {
    Meter: "m",
    CentiMeter: "cm",
    Millimeter: "mm",
  };

  const [state, setState] = useState<State>({
    propertyValueSet: PropertyValueSet.fromString("a=10:Meter", unitLookup),
    selectedFormat: { unit: units.Meter, decimalCount: 1 },
  });

  const onValueChange = useCallback(
    (pv) =>
      setState({
        ...state,
        propertyValueSet: PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, state.propertyValueSet),
      }),
    [state, setState]
  );

  const onFormatChanged: UseAmountFormatSelectorOnFormatChanged = useCallback(
    (format) => setState({ ...state, selectedFormat: format }),
    [state, setState]
  );

  const onFormatCleared = useCallback(
    () => setState({ ...state, selectedFormat: { unit: units.Meter, decimalCount: 1 } }),
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
    getSelectableFormats: () => formatsArrayToZipList(selectableFormats, state.selectedFormat),
    unitLabels: unitLabels,
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

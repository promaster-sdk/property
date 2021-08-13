import React, { useCallback, useState } from "react";
import { Meta } from "@storybook/react";
import { Unit, BaseUnits, UnitMap } from "uom";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { units, unitsFormat } from "../units-map";
import { MyAmountSelector } from "../selector-ui/selector-ui";
import { UseAmountPropertySelectorOptions } from "../..";

const unitLookup: UnitMap.UnitLookup = (unitString) => (units as UnitMap.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly selectedUnit: Unit.Unit<unknown>;
  readonly selectedDecimalCount: number;
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
  const [state, setState] = useState<State>({
    propertyValueSet: PropertyValueSet.fromString("a=10:Meter", unitLookup),
    selectedUnit: BaseUnits.Meter,
    selectedDecimalCount: 2,
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
    (selectedUnit, selectedDecimalCount) => setState({ ...state, selectedUnit, selectedDecimalCount }),
    [state, setState]
  );

  const onFormatCleared = useCallback(
    () =>
      setState({
        ...state,
        selectedUnit: BaseUnits.Meter,
        selectedDecimalCount: 2,
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
    onFormatChanged,
    onFormatCleared,
    // inputUnit: state.selectedUnit,
    // inputDecimalCount: state.selectedDecimalCount,
    // unitsFormat: unitsFormat,
    // units: units,
    getSelectableUnits: () => [],
    selectedUnitIndex: 0,
    selectedDecimalCountIndex: 0,
  };

  return (
    <div>
      <div>AmountPropertySelector:</div>
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

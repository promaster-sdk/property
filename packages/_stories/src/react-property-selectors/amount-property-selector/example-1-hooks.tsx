import React, { useCallback, useState } from "react";
import { Unit, BaseUnits } from "uom";
import {
  getDefaultAmountInputBoxStyle,
  useAmountPropertySelector
} from "@promaster-sdk/react-property-selectors";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import {
  PropertyFilter,
  PropertyValueSet,
  PropertyValue
} from "@promaster-sdk/property";
import { merge } from "../utils";
import { units, unitsFormat } from "../units-map";

const unitLookup: Unit.UnitLookup = unitString =>
  (units as Unit.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly selectedUnit: Unit.Unit<unknown>;
  readonly selectedDecimalCount: number;
}

const filterPrettyPrint = (
  propertyFilter: PropertyFilter.PropertyFilter
): string =>
  PropertyFiltering.filterPrettyPrintIndented(
    PropertyFiltering.buildEnglishMessages(unitsFormat),
    2,
    " ",
    propertyFilter,
    unitsFormat,
    unitLookup
  );

const validationFilter = PropertyFilter.fromString("a<100:Meter", unitLookup)!;

export function AmountPropertySelectorExample1Hooks(): React.ReactElement<{}> {
  const [state, setState] = useState<State>({
    propertyValueSet: PropertyValueSet.fromString("a=10:Meter", unitLookup),
    selectedUnit: BaseUnits.Meter,
    selectedDecimalCount: 2
  });

  const onValueChange = useCallback(
    pv =>
      setState(
        merge(state, {
          propertyValueSet: PropertyValueSet.set(
            "a",
            pv as PropertyValue.PropertyValue,
            state.propertyValueSet
          )
        })
      ),
    []
  );

  const selA = useAmountPropertySelector({
    fieldName: "a",
    propertyName: "a",
    propertyValueSet: state.propertyValueSet,
    inputUnit: state.selectedUnit,
    inputDecimalCount: state.selectedDecimalCount,
    onValueChange,
    filterPrettyPrint: filterPrettyPrint,
    validationFilter: validationFilter,
    readonly: false,
    isRequiredMessage: "Is required",
    notNumericMessage: "Not numeric",
    onFormatChanged: (selectedUnit, selectedDecimalCount) =>
      setState(merge(state, { selectedUnit, selectedDecimalCount })),
    onFormatCleared: () =>
      setState(
        merge(state, {
          selectedUnit: BaseUnits.Meter,
          selectedDecimalCount: 2
        })
      ),
    unitsFormat: unitsFormat,
    units: units
  });

  return (
    <div>
      <div>AmountPropertySelector:</div>
      <div>
        PropertyValueSet: {PropertyValueSet.toString(state.propertyValueSet)}
      </div>
      <div>
        <span id="AmountPropertySelectorWrapper" {...selA.getWrapperProps()}>
          {/* AmountInput */}
          <input
            {...selA.amountInputBox.getInputProps()}
            style={getDefaultAmountInputBoxStyle(selA.amountInputBox)}
          />
          {/* AmountFormat */}
          <span {...selA.amountFormatSelector.getWrapperProps()}>
            {selA.amountFormatSelector.active ? (
              <>
                <select {...selA.amountFormatSelector.getUnitSelectorProps()}>
                  {selA.amountFormatSelector.unitSelectorOptions.map(o => (
                    <option {...o.getOptionProps()}> {o.label} </option>
                  ))}
                </select>
                <select
                  {...selA.amountFormatSelector.getPrecisionSelectorProps()}
                >
                  {selA.amountFormatSelector.precisionSelectorOptions.map(o => (
                    <option {...o.getOptionProps()}>{o.label}</option>
                  ))}
                </select>
                {selA.amountFormatSelector.showClearButton && (
                  <button {...selA.amountFormatSelector.getClearButtonProps()}>
                    Cancel
                  </button>
                )}
                <button {...selA.amountFormatSelector.getCancelButtonProps()}>
                  Clear
                </button>
              </>
            ) : (
              selA.amountFormatSelector.label
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

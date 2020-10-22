import React, { useState } from "react";
import { Unit, BaseUnits, UnitMap } from "uom";
import { createAmountPropertySelector } from "@promaster-sdk/react-properties-selector";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
import { PropertyFilter, PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { merge } from "../../utils";
import { units, unitsFormat } from "../../units-map";

const unitLookup: UnitMap.UnitLookup = (unitString) => (units as UnitMap.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly selectedUnit: Unit.Unit<any>;
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

const validationFilter = PropertyFilter.fromString("a<100:Meter", unitLookup) as PropertyFilter.PropertyFilter;

const AmountPropertySelector = createAmountPropertySelector({});

export function AmountPropertySelectorExample1(): React.ReactElement<{}> {
  const [state, setState] = useState<State>({
    propertyValueSet: PropertyValueSet.fromString("a=10:Meter", unitLookup),
    selectedUnit: BaseUnits.Meter,
    selectedDecimalCount: 2,
  });

  return (
    <div>
      <div>AmountPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(state.propertyValueSet)}</div>
      <div>
        <AmountPropertySelector
          fieldName="a"
          propertyName="a"
          propertyValueSet={state.propertyValueSet}
          inputUnit={state.selectedUnit}
          inputDecimalCount={state.selectedDecimalCount}
          onValueChange={(pv) =>
            setState(
              merge(state, {
                propertyValueSet: PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, state.propertyValueSet),
              })
            )
          }
          filterPrettyPrint={filterPrettyPrint}
          validationFilter={validationFilter}
          readOnly={false}
          isRequiredMessage="Is required"
          notNumericMessage="Not numeric"
          onFormatChanged={(selectedUnit, selectedDecimalCount) =>
            setState(merge(state, { selectedUnit, selectedDecimalCount }))
          }
          onFormatCleared={() =>
            setState(
              merge(state, {
                selectedUnit: BaseUnits.Meter,
                selectedDecimalCount: 2,
              })
            )
          }
          unitsFormat={unitsFormat}
          units={units}
        />
      </div>
    </div>
  );
}

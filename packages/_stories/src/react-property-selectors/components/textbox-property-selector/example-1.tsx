import React, { useState } from "react";
import { BaseUnits, UnitMap } from "uom";
import { createTextboxPropertySelector } from "@promaster-sdk/react-property-selectors";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

const TextboxPropertySelector = createTextboxPropertySelector({});

export function TextboxPropertySelectorExample1(): React.ReactElement<{}> {
  const [myState, setMyState] = useState(PropertyValueSet.fromString('a="This is the value";b=3', unitLookup));
  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <TextboxPropertySelector
          propertyName="a"
          propertyValueSet={myState}
          onValueChange={(pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState))}
          readOnly={false}
          debounceTime={600}
        />
      </div>
    </div>
  );
}

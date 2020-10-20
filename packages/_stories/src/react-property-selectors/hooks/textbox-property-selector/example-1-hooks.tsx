import React, { useCallback, useState } from "react";
import { BaseUnits, UnitMap } from "uom";
import { useTextboxPropertySelector } from "@promaster-sdk/react-property-selectors";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

// const TextboxPropertySelector = createTextboxPropertySelector({});

export function TextboxPropertySelectorExample1Hooks(): React.ReactElement<{}> {
  const [myState, setMyState] = useState(PropertyValueSet.fromString('a="This is the value";b=3', unitLookup));

  const onValueChange = useCallback(
    (pv) => setMyState(PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)),
    []
  );

  const { getInputProps } = useTextboxPropertySelector({
    propertyName: "a",
    propertyValueSet: myState,
    onValueChange,
    readOnly: false,
    debounceTime: 600,
  });

  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <input {...getInputProps()} />
      </div>
    </div>
  );
}

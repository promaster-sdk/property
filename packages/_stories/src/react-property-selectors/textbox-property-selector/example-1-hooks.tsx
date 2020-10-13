import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import {
  // createTextboxPropertySelector,
  useTextboxPropertySelector
} from "@promaster-sdk/react-property-selectors";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";

const unitLookup: Unit.UnitLookup = unitString =>
  (BaseUnits as Unit.UnitMap)[unitString];

// const TextboxPropertySelector = createTextboxPropertySelector({});

export function TextboxPropertySelectorExample1Hooks(): React.ReactElement<{}> {
  const [myState, setMyState] = useState(
    PropertyValueSet.fromString('a="This is the value";b=3', unitLookup)
  );

  const { getInputProps } = useTextboxPropertySelector({
    propertyName: "a",
    propertyValueSet: myState,
    onValueChange: pv =>
      setMyState(
        PropertyValueSet.set("a", pv as PropertyValue.PropertyValue, myState)
      ),

    readOnly: false,
    debounceTime: 600
  });

  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <input {...getInputProps()} />
        {/* <TextboxPropertySelector
          propertyName="a"
          propertyValueSet={myState}
          onValueChange={(pv) =>
            setMyState(
              PropertyValueSet.set(
                "a",
                pv as PropertyValue.PropertyValue,
                myState
              )
            )
          }
          readOnly={false}
          debounceTime={600}
        /> */}
      </div>
    </div>
  );
}

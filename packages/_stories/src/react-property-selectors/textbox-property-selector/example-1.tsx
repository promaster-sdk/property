/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import { createTextboxPropertySelector } from "@promaster-sdk/react-property-selectors";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";

const unitLookup: Unit.UnitLookup = unitString =>
  (BaseUnits as Unit.UnitMap)[unitString];

const TextboxPropertySelector = createTextboxPropertySelector({});

export function TextboxPropertySelectorExample1(): React.ReactElement<{}> {
  const [myState, setMyState] = useState(
    PropertyValueSet.fromString('a="This is the value";b=3', unitLookup)
  );
  return (
    <div>
      <div>ComboboxPropertySelector:</div>
      <div>PropertyValueSet: {PropertyValueSet.toString(myState)}</div>
      <div>
        <TextboxPropertySelector
          propertyName="a"
          propertyValueSet={myState}
          onValueChange={pv =>
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
        />
      </div>
    </div>
  );
}
// }

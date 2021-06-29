import React, { useState } from "react";
import { Meta } from "@storybook/react";
import { BaseUnits, UnitMap } from "uom";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { createTextboxPropertySelector } from "../../textbox";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

const TextboxPropertySelector = createTextboxPropertySelector({});

export function Example1(): React.ReactElement<{}> {
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

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "COMP/Textbox Property Selector",
} as Meta;

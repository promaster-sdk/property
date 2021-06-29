import React, { useCallback, useState } from "react";
import { Meta } from "@storybook/react";
import { BaseUnits, UnitMap } from "uom";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { useTextboxPropertySelector } from "../../textbox";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

// const TextboxPropertySelector = createTextboxPropertySelector({});

export function Example1(): React.ReactElement<{}> {
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
        <input type="text" {...getInputProps()} />
      </div>
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "HOOKS/Textbox Property Selector",
} as Meta;

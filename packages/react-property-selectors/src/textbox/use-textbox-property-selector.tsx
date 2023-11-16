import React, { useCallback, useState } from "react";
import { PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import { debounce } from "../debounce";

export interface UseTextboxPropertySelectorOptions {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly readOnly: boolean;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly debounceTime: number;
}

export type TextboxPropertySelectorInputProps = {
  readonly value: string;
  readonly readOnly: boolean;
  readonly onChange: React.ChangeEventHandler<{ readonly value: string }>;
};

export type UseTextboxPropertySelector = {
  readonly getInputProps: () => TextboxPropertySelectorInputProps;
};

export function useTextboxPropertySelector({
  propertyName,
  propertyValueSet,
  onValueChange,
  readOnly,
  debounceTime,
}: UseTextboxPropertySelectorOptions): UseTextboxPropertySelector {
  const debouncedOnValueChange = useCallback(
    debounce((newValue: PropertyValue.PropertyValue) => onValueChange(newValue), debounceTime),
    [onValueChange, debounceTime]
  );

  const value = PropertyValueSet.getText(propertyName, propertyValueSet);
  const [myState, setMyState] = useState(value || "");
  return {
    getInputProps: () => ({
      value: myState,
      readOnly: readOnly,
      onChange: (e) => {
        const newStringValue = e.target.value;
        setMyState(newStringValue);
        debouncedOnValueChange(PropertyValue.create("text", newStringValue));
      },
    }),
  };
}

import React, { useCallback, useState } from "react";
import { PropertyValue, PropertyValueSet } from "@promaster-sdk/property";

export interface UseTextboxPropertySelectorParams {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly readOnly: boolean;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly debounceTime: number;
}

export type UseTextboxPropertySelector = {
  readonly getInputProps: () => React.SelectHTMLAttributes<HTMLInputElement>;
};

export function useTextboxPropertySelector({
  propertyName,
  propertyValueSet,
  onValueChange,
  readOnly,
  debounceTime,
}: UseTextboxPropertySelectorParams): UseTextboxPropertySelector {
  const debouncedOnValueChange = useCallback(
    debounce((newValue: PropertyValue.PropertyValue) => onValueChange(newValue), debounceTime),
    [onValueChange, debounceTime]
  );

  const value = PropertyValueSet.getText(propertyName, propertyValueSet);
  const [myState, setMyState] = useState(value || "");
  return {
    getInputProps: () => ({
      type: "text",
      value: myState,
      readOnly: readOnly,
      onChange: (e) => {
        const newStringValue = (e.target as HTMLInputElement).value;
        setMyState(newStringValue);
        debouncedOnValueChange(PropertyValue.create("text", newStringValue));
      },
    }),
  };
}

// (From underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce(func: Function, wait: number, immediate?: boolean): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any): void {
    const context = this; //eslint-disable-line
    const args = arguments; //eslint-disable-line
    const later = function (): void {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

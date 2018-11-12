import * as React from "react";
import { PropertyValue, PropertyValueSet } from "@promaster/property";

export interface TextboxPropertySelectorProps {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly readOnly: boolean;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly debounceTime: number;
}

export interface State {
  readonly textValue: string;
}

export type TextboxPropertySelector = React.ComponentClass<
  TextboxPropertySelectorProps
>;
export interface CreateTextboxPropertySelectorProps {
  readonly StyledInputTextBox?: React.ComponentType<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  >;
}

export const defaultStyledInputTextBox = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => (
  <input
    {...props}
    style={{
      color: "black",
      height: "30px",
      border: "1px solid #b4b4b4",
      borderRadius: "3px",
      font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
      outline: "rgb(131, 131, 131) none 0px",
      padding: "1px 30px 0px 10px"
    }}
  />
);

export function createTextboxPropertySelector({
  StyledInputTextBox = defaultStyledInputTextBox
}: CreateTextboxPropertySelectorProps): TextboxPropertySelector {
  // tslint:disable no-this no-class
  return class TextboxPropertySelector extends React.Component<
    TextboxPropertySelectorProps,
    State
  > {
    constructor(props: TextboxPropertySelectorProps) {
      super(props);
      // What the optimal debounce is may vary between users. 350ms seems like a nice value...
      this._debouncedOnValueChange = debounce(
        this._debouncedOnValueChange,
        this.props.debounceTime
      );
    }

    componentWillMount(): void {
      const { propertyName, propertyValueSet } = this.props;
      const value = PropertyValueSet.getText(propertyName, propertyValueSet);
      this.setState({ textValue: value || "" });
    }

    componentWillReceiveProps(nextProps: TextboxPropertySelectorProps): void {
      const { propertyName, propertyValueSet } = nextProps;
      const value = PropertyValueSet.getText(propertyName, propertyValueSet);
      this.setState({ textValue: value || "" });
    }

    render(): React.ReactElement<TextboxPropertySelectorProps> {
      const { onValueChange, readOnly } = this.props;
      const { textValue } = this.state;

      return (
        <StyledInputTextBox
          type="text"
          value={textValue}
          readOnly={readOnly}
          onChange={e => this._onChange(e, onValueChange)}
        />
      );
    }

    _debouncedOnValueChange(
      newValue: PropertyValue.PropertyValue,
      onValueChange: (newValue: PropertyValue.PropertyValue) => void
    ): void {
      onValueChange(newValue);
    }

    _onChange(
      e: React.FormEvent<HTMLInputElement>,
      onValueChange: (newValue: PropertyValue.PropertyValue) => void
    ): void {
      let newStringValue = (e.target as HTMLInputElement).value;
      this.setState({ textValue: newStringValue });
      this._debouncedOnValueChange(
        PropertyValue.create("text", newStringValue),
        onValueChange
      );
    }
  };
}

// (From underscore.js)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// tslint:disable-next-line:no-any
function debounce(func: Function, wait: number, immediate?: boolean): any {
  // tslint:disable-next-line:no-any
  let timeout: any;
  // tslint:disable-next-line:no-any
  return function(this: any): void {
    //tslint:disable-line
    const context = this; //tslint:disable-line
    const args = arguments; //tslint:disable-line
    const later = function(): void {
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

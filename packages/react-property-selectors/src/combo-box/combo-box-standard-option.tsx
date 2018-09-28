import * as React from "react";
import { OptionElement, OptionElementProps } from "./option-element";

export interface ComboBoxStandardOptionProps {
  readonly isItemValid: boolean;
  readonly toolTip: string;
  readonly label: string;
  readonly value: string;
  readonly className?: string; // fix styled component typings
}

export interface CreateComboBoxStandardOptionParams {
  readonly OptionElement?: React.ComponentType<OptionElementProps>;
}

// function isItemValid(
//   props: OptionElementProps
// ): Array<StyledComponents.InterpolationValue> {
//   if (props.isItemValid) {
//     return StyledComponents.css``;
//   }

//   return StyledComponents.css`color: red;`;
// }

// export const defaultOptionElement = styled(OptionElement)`
//   color: rgb(131, 131, 131);
//   min-height: 18px;
//   align-self: center;
//   border: 0px none rgb(131, 131, 131);
//   font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
//   outline: rgb(131, 131, 131) none 0px;

//   ${isItemValid};
// `;

export const defaultOptionElement = (props: OptionElementProps) => (
  <OptionElement
    {...props}
    style={{
      color: props.isItemValid ? "rgb(131, 131, 131)" : "red",
      minHeight: "18px",
      alignSelf: "center",
      border: "0px none rgb(131, 131, 131)",
      font: "normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif",
      outline: "rgb(131, 131, 131) none 0px"
    }}
  />
);

export function createComboBoxStandardOption({
  OptionElement = defaultOptionElement
}: CreateComboBoxStandardOptionParams): React.StatelessComponent<
  ComboBoxStandardOptionProps
> {
  return function ComboBoxStandardOption({
    value,
    toolTip,
    label,
    isItemValid
  }: ComboBoxStandardOptionProps): JSX.Element {
    return (
      <OptionElement
        key={`${label}-${value}`}
        value={value}
        title={toolTip}
        isItemValid={isItemValid}
      >
        {(isItemValid ? "" : "✘ ") + label}
      </OptionElement>
    );
  };
}

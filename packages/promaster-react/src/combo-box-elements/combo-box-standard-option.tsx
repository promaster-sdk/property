import * as React from "react";
import styled, { css, InterpolationValue } from "styled-components";
import { OptionElement, OptionElementProps } from "./option-element";

export interface ComboBoxStandardOptionProps {
  readonly isItemValid: boolean,
  readonly toolTip: string,
  readonly label: string,
  readonly value: string,
  readonly className?: string // fix styled component typings
}

export interface CreateComboBoxStandardOptionParams {
  readonly OptionElement?: React.ComponentType<OptionElementProps>
}

function isItemValid(props: OptionElementProps): Array<InterpolationValue> {
  if (props.isItemValid) {
    return css``;
  }

  return css`color: red;`;
}

const defaultOptionElement = styled(OptionElement) `
    color: rgb(131, 131, 131);
    min-height: 18px;
    align-self: center;
    border: 0px none rgb(131, 131, 131);
    font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;
    outline: rgb(131, 131, 131) none 0px;

    ${isItemValid}
`;

export function createComboBoxStandardOption({
  OptionElement = defaultOptionElement
}: CreateComboBoxStandardOptionParams): React.StatelessComponent<ComboBoxStandardOptionProps> {
  return function ComboBoxStandardOption({
    value,
    toolTip,
    label,
    isItemValid,
}: ComboBoxStandardOptionProps): JSX.Element {
    return (
      <OptionElement
        key={`${label}-${value}`}
        value={value}
        title={toolTip}
        isItemValid={isItemValid}>
        {(isItemValid ? "" : "✘ ") + label}
      </OptionElement>
    );
  };

}

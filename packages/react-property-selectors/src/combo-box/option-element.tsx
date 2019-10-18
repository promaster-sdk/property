import * as React from "react";

export type OptionElementProps = {
  readonly isItemValid: boolean;
} & React.DetailedHTMLProps<
  React.OptionHTMLAttributes<HTMLOptionElement>,
  HTMLOptionElement
>;

export const OptionElement = ({
  isItemValid: _,
  ...htmlProps
}: OptionElementProps): JSX.Element => (
  <option {...htmlProps}>{htmlProps.children}</option>
);

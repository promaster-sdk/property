import * as React from "react";

export type OptionElementProps = {
  readonly isItemValid: boolean;
} & React.DetailedHTMLProps<
  React.OptionHTMLAttributes<HTMLOptionElement>,
  HTMLOptionElement
>;

// tslint:disable-next-line:variable-name
export const OptionElement = ({
  isItemValid: _,
  ...htmlProps
}: OptionElementProps): JSX.Element => (
  <option {...htmlProps}>{htmlProps.children}</option>
);

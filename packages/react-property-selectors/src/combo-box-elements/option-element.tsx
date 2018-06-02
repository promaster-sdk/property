import * as React from "react";

export type OptionElementProps = {
  readonly isItemValid: boolean;
} & React.HTMLProps<HTMLOptionElement>;

// tslint:disable-next-line:variable-name
export const OptionElement = ({
  isItemValid: _,
  ...htmlProps
}: OptionElementProps) => <option {...htmlProps}>{htmlProps.children}</option>;

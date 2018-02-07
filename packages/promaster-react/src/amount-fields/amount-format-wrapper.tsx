import * as React from "react";

export type AmountFormatWrapperProps = {
  readonly active: boolean;
} & React.HTMLProps<HTMLSpanElement>;

// tslint:disable-next-line:variable-name
export const AmountFormatWrapper = ({
  active: _,
  ...htmlProps
}: AmountFormatWrapperProps) => (
  <span {...htmlProps}>{htmlProps.children}</span>
);

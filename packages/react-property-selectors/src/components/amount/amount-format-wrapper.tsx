import React from "react";

export type AmountFormatWrapperProps = {
  readonly active: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const AmountFormatWrapper = ({
  active: _,
  ...htmlProps
}: AmountFormatWrapperProps) => (
  <span {...htmlProps}>{htmlProps.children}</span>
);

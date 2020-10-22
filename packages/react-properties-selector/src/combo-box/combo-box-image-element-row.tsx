import React from "react";

export type ComboBoxImageOptionElementRowProps = {
  readonly isItemValid?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function ComboBoxImageOptionElementRow({
  isItemValid: _,
  ...htmlProps
}: ComboBoxImageOptionElementRowProps): JSX.Element {
  return <div {...htmlProps}>{htmlProps.children}</div>;
}

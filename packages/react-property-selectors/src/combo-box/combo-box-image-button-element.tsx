import * as React from "react";

export type ComboBoxImageButtonElementProps = {
  readonly isSelectedItemValid?: boolean;
  readonly locked: boolean;
} & React.HTMLProps<HTMLDivElement>;

export function comboBoxImageElement({
  isSelectedItemValid: _,
  locked: _1,
  ...htmlProps
}: ComboBoxImageButtonElementProps): JSX.Element {
  return <div {...htmlProps}>{htmlProps.children}</div>;
}

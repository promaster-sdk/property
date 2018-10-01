import * as React from "react";

export type ComboBoxImageElementProps = {
  readonly isSelectedItemValid?: boolean;
  readonly locked: boolean;
} & React.HTMLProps<HTMLDivElement>;

export function ComboBoxImageElement({
  isSelectedItemValid: _,
  locked: _1,
  ...htmlProps
}: ComboBoxImageElementProps): JSX.Element {
  return <div {...htmlProps}>{htmlProps.children}</div>;
}
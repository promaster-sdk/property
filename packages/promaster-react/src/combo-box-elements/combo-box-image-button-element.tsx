import * as React from "react";

export type ComboBoxImageButtonElementProps = {
  isSelectedItemValid?: boolean,
  locked: boolean,
} & React.HTMLProps<HTMLDivElement>;

export function comboBoxImageElement({
  isSelectedItemValid: _,
  locked: _1,
  ...htmlProps,
}: ComboBoxImageButtonElementProps): JSX.Element {
  return (
    <div {...htmlProps}>{htmlProps.children}</div>
  );
}

import * as React from "react";

export type ComboBoxStandardSelectProps = {
  readonly isSelectedItemValid: boolean;
  readonly locked: boolean;
} & React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export function ComboBoxStandardSelect({
  isSelectedItemValid: _,
  locked: _1,
  ...htmlProps
}: ComboBoxStandardSelectProps): JSX.Element {
  return <select {...htmlProps}>{htmlProps.children}</select>;
}

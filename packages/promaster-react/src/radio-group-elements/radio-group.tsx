import * as React from "react";

export type RadioGroupProps = {
  locked: boolean,
} & React.HTMLProps<HTMLDivElement>;

export function RadioGroup({
  locked: _1,
  ...htmlProps,
}: RadioGroupProps): JSX.Element {
  return (
    <div {...htmlProps}>{htmlProps.children}</div>
  );
}

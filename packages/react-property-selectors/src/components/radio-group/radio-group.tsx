import React from "react";

export type RadioGroupProps = {
  readonly locked: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function RadioGroup({ locked: _1, ...htmlProps }: RadioGroupProps): JSX.Element {
  return <div {...htmlProps}>{htmlProps.children}</div>;
}

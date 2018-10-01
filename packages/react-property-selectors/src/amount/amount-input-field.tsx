import * as React from "react";

export type AmountInputFieldProps = {
  readonly isReadonly: boolean;
  readonly effectiveErrorMessage: string;
} & React.HTMLProps<HTMLInputElement>;

// tslint:disable-next-line:variable-name
export const AmountInputField: React.ComponentType<AmountInputFieldProps> = ({
  isReadonly: _,
  effectiveErrorMessage: _1,
  type: _2,
  ...htmlProps
}: AmountInputFieldProps) => <input type="text" {...htmlProps} />;
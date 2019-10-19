import React from "react";

export type RadioGroupItemProps = {
  readonly sortNo: number;
  readonly selected: boolean;
  readonly label: string;
  readonly imageUrl: string | undefined;
  readonly toolTip: string;
  readonly onClick: () => void;
  readonly isItemValid: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function RadioGroupItem({
  sortNo: _,
  isItemValid: _1,
  label,
  imageUrl,
  toolTip,
  onClick,
  ...htmlProps
}: RadioGroupItemProps): JSX.Element {
  return (
    <div onClick={onClick} title={toolTip} {...htmlProps}>
      {imageUrl ? <img src={imageUrl} /> : undefined}
      {label}
    </div>
  );
}

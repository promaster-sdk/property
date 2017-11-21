import * as React from "react";

export type RadioGroupItemProps = {
  readonly sortNo: number,
  readonly selected: boolean,
  readonly label: string,
  readonly imageUrl: string | undefined,
  readonly toolTip: string,
  readonly onClick: () => void
  readonly isItemValid: boolean,
} & React.HTMLProps<HTMLDivElement>;

export function RadioGroupItem({
    label,
    imageUrl,
    toolTip,
    onClick,
    ...htmlProps
}: RadioGroupItemProps): JSX.Element {
  return (
    <div
      key={label}
      onClick={onClick}
      title={toolTip}
      {...htmlProps}
      >
      {imageUrl ? <img src={imageUrl} /> : undefined}
      {label}
    </div>
  );
}

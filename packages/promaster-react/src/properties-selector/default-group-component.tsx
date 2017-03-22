import * as React from "react";
import { OnToggleGroupClosed, TranslateGroupName } from "./types";

export interface GroupComponentProps {
  readonly isClosedGroup: boolean,
  readonly groupName: string,
  readonly onToggleGroupClosed: OnToggleGroupClosed,
  readonly translateGroupName: TranslateGroupName,
  readonly children?: ReadonlyArray<React.ReactElement<{}>>,
}

export function DefaultGroupComponent({
  isClosedGroup,
  groupName,
  onToggleGroupClosed,
  translateGroupName,
  children
}: GroupComponentProps) {
  const className1 = 'group-container' + (isClosedGroup || groupName === "Main" ? ' expanded' : ' collapsed'); // temp fix to hide on start
  return (
    <div key={groupName} className={className1}>
      <div className="group-container-header" onClick={() => onToggleGroupClosed(groupName)}>
        <button className="expand-collapse">&nbsp;>>&nbsp;</button>
        {translateGroupName(groupName)}
      </div>
      {children}
    </div>
  );
}



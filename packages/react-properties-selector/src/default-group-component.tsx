import * as React from "react";
import { OnToggleGroupClosed, TranslateGroupName } from "./types";

export interface GroupComponentProps {
  readonly isClosedGroup: boolean;
  readonly groupName: string;
  readonly onToggleGroupClosed: OnToggleGroupClosed;
  readonly translateGroupName: TranslateGroupName;
  readonly children?: ReadonlyArray<React.ReactElement<{}>>;
}

export function DefaultGroupComponent({
  isClosedGroup,
  groupName,
  onToggleGroupClosed,
  translateGroupName,
  children
}: GroupComponentProps): React.ReactElement<GroupComponentProps> {
  return (
    <div key={groupName}>
      {groupName !== "" ? (
        <div
          className="group-container-header"
          onClick={() => onToggleGroupClosed(groupName)}
        >
          <button className="expand-collapse">&nbsp;>>&nbsp;</button>
          {translateGroupName(groupName)}
        </div>
      ) : (
        ""
      )}
      <table>
        <tbody>{isClosedGroup ? "" : children}</tbody>
      </table>
    </div>
  );
}

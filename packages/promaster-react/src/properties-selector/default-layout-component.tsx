import * as React from "react";
import {
  RenderedPropertySelector, RenderedPropertyLabels,
  TranslateGroupName, OnToggleGroupClosed
} from "./types";
import {GroupComponentProps} from "./default-group-component";
import {GroupItemComponentProps} from "./default-group-item-component";
import {ReactComponent} from "./properties-selector";

export interface LayoutComponentProps {
  readonly selectors: Array<RenderedPropertySelector>,
  readonly labels: RenderedPropertyLabels,
  readonly translateGroupName: TranslateGroupName,
  readonly closedGroups: Array<string>,
  readonly onToggleGroupClosed: OnToggleGroupClosed,
  readonly GroupComponent: ReactComponent<GroupComponentProps>,
  readonly GroupItemComponent: ReactComponent<GroupItemComponentProps>,
}

export function DefaultLayoutComponent({
  selectors,
  labels,
  translateGroupName,
  closedGroups,
  onToggleGroupClosed,
  GroupComponent,
  GroupItemComponent,
}: LayoutComponentProps) {

  const groups = getDistinctGroupNames(selectors);

  return (
    <div className="properties-selector">
      {
        groups.map((groupName: any) => {
          const isClosedGroup = closedGroups.indexOf(groupName) !== -1;
          const renderedSelectorsForGroup = selectors.filter((selector) => selector.groupName === (groupName || ''));
          return (
            <GroupComponent key={groupName}
                                     isClosedGroup={isClosedGroup}
                                     groupName={groupName}
                                     onToggleGroupClosed={onToggleGroupClosed}
                                     translateGroupName={translateGroupName}>
              {renderedSelectorsForGroup.map((selector) => (
                <GroupItemComponent key={selector.propertyName} selector={selector}
                                             label={labels[selector.propertyName]}/>
              ))}
            </GroupComponent>
          );
        })
      }
    </div>
  );

}


function getDistinctGroupNames(productPropertiesArray: Array<RenderedPropertySelector>): Array<string> {
  const groupNames: Array<string> = [];
  for (let property of productPropertiesArray) {
    if (groupNames.indexOf(property.groupName) === -1 && !isNullOrWhiteSpace(property.groupName)) {
      groupNames.push(property.groupName);
    }
  }
  return groupNames;
}

function isNullOrWhiteSpace(str: string) {
  return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, '').length < 1;
}

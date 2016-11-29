import * as React from "react";
import {
  RenderedPropertySelector, RenderedPropertyLabels,
  TranslateGroupName, OnToggleGroupClosed
} from "./types";
import {PropertiesSelectorGroup} from "./properties-selector-group";

export interface PropertiesSelectorLayoutProps {
  readonly selectors: Array<RenderedPropertySelector>,
  readonly labels: RenderedPropertyLabels,
  readonly translateGroupName: TranslateGroupName,
  readonly closedGroups: Array<string>,
  readonly onToggleGroupClosed: OnToggleGroupClosed,
}

export function PropertiesSelectorLayout({
  selectors,
  labels,
  translateGroupName,
  closedGroups,
  onToggleGroupClosed,
}: PropertiesSelectorLayoutProps) {

  const groups = getDistinctGroupNames(selectors);

  return (
    <div className="properties-selector">
      {
        groups.map((groupName: any) => {
          const isClosedGroup = closedGroups.indexOf(groupName) !== -1;
          const renderedSelectorsForGroup = selectors.filter((selector) => selector.groupName === (groupName || ''));
          return (
            <PropertiesSelectorGroup key={groupName}
                                     isClosedGroup={isClosedGroup}
                                     groupName={groupName}
                                     onToggleGroupClosed={onToggleGroupClosed}
                                     translateGroupName={translateGroupName}
                                     renderedSelectorsForGroup={renderedSelectorsForGroup}
                                     labels={labels}
            />
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

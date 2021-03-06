import React from "react";
import { PropertySelectorRenderInfo, TranslateGroupName, OnToggleGroupClosed, ReactComponent } from "./types";
import { GroupComponentProps } from "./default-group-component";
import { GroupItemComponentProps } from "./default-group-item-component";
import { PropertyLabelComponentProps } from "./default-property-label-component";
import { PropertySelectorProps } from "./default-property-selector-component";

export interface LayoutRendererProps {
  readonly selectors: ReadonlyArray<PropertySelectorRenderInfo>;
  readonly translateGroupName: TranslateGroupName;
  readonly closedGroups: ReadonlyArray<string>;
  readonly onToggleGroupClosed: OnToggleGroupClosed;
  readonly GroupComponent: ReactComponent<GroupComponentProps>;
  readonly GroupItemComponent: ReactComponent<GroupItemComponentProps>;
  readonly PropertySelectorComponent: ReactComponent<PropertySelectorProps>;
  readonly PropertyLabelComponent: ReactComponent<PropertyLabelComponentProps>;
}

export function DefaultLayoutRenderer({
  selectors,
  translateGroupName,
  closedGroups,
  onToggleGroupClosed,
  GroupComponent,
  GroupItemComponent,
  PropertySelectorComponent,
  PropertyLabelComponent,
}: LayoutRendererProps): React.ReactElement<LayoutRendererProps> {
  const groups = getDistinctGroupNames(selectors);

  return (
    <div>
      {groups.map((groupName) => {
        const isClosedGroup = closedGroups.indexOf(groupName) !== -1;
        const renderedSelectorsForGroup = selectors.filter((selector) => selector.groupName === (groupName || ""));
        return (
          <GroupComponent
            key={groupName}
            isClosedGroup={isClosedGroup}
            groupName={groupName}
            onToggleGroupClosed={onToggleGroupClosed}
            translateGroupName={translateGroupName}
          >
            {renderedSelectorsForGroup.map((selector) => (
              <GroupItemComponent
                key={selector.propertyName}
                selector={selector}
                PropertySelectorComponent={PropertySelectorComponent}
                PropertyLabelComponent={PropertyLabelComponent}
              />
            ))}
          </GroupComponent>
        );
      })}
    </div>
  );
}

function getDistinctGroupNames(
  productPropertiesArray: ReadonlyArray<PropertySelectorRenderInfo>
): ReadonlyArray<string> {
  const groupNames: Array<string> = [];
  for (const property of productPropertiesArray) {
    // let groupName = property.groupName;
    if (isNullOrWhiteSpace(property.groupName)) {
      // groupName = "";
    }
    if (groupNames.indexOf(property.groupName) === -1) {
      groupNames.push(property.groupName);
    }
  }
  return groupNames;
}

function isNullOrWhiteSpace(str: string): boolean {
  return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, "").length < 1;
}

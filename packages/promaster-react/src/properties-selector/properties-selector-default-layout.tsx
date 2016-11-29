import * as React from "react";
import {
  PropertiesSelectorLayoutProps, RenderedPropertySelector, OnToggleGroupClosed,
  TranslateGroupName, RenderedPropertyLabels, RenderedPropertyLabel
} from "./types";

export function PropertiesSelectorDefaultLayout({
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
            <GroupComponent isClosedGroup={isClosedGroup}
                            groupName="sadf"
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

interface GroupComponentProps {
  isClosedGroup: boolean,
  groupName: string,
  onToggleGroupClosed: OnToggleGroupClosed,
  translateGroupName: TranslateGroupName,
  renderedSelectorsForGroup: Array<RenderedPropertySelector>,
  labels: RenderedPropertyLabels
}

function GroupComponent({
  isClosedGroup,
  groupName,
  onToggleGroupClosed,
  translateGroupName,
  renderedSelectorsForGroup,
  labels
}:GroupComponentProps) {
  const className1 = 'group-container' + (isClosedGroup || groupName === "Main" ? ' expanded' : ' collapsed'); // temp fix to hide on start
  return (
    <div key={groupName} className={className1}>
      <div className="group-container-header" onClick={() => onToggleGroupClosed(groupName)}>
        <button className="expand-collapse">&nbsp;>>&nbsp;</button>
        {translateGroupName(groupName)}
      </div>
      {
        renderedSelectorsForGroup.map((selector) => (
            <GroupItemComponent selector={selector} label={labels[selector.propertyName]}/>
          )
        )
      }
    </div>
  );
}

interface SelectorWithLabelComponentProps {
  selector: RenderedPropertySelector,
  label: RenderedPropertyLabel
}

function GroupItemComponent({
  selector,
  label
}: SelectorWithLabelComponentProps): React.ReactElement<SelectorWithLabelComponentProps> {
  return (
    <div key={selector.propertyName} className="property-selector-row">
      {label}
      {selector.renderedSelectorElement}
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

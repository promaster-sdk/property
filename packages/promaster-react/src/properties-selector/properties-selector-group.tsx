import * as React from "react";
import {
  RenderedPropertySelector, OnToggleGroupClosed,
  TranslateGroupName, RenderedPropertyLabels
} from "./types";
import {PropertiesSelectorGroupItem} from "./properties-selector-group-item";

export interface PropertiesSelectorGroupProps {
  isClosedGroup: boolean,
  groupName: string,
  onToggleGroupClosed: OnToggleGroupClosed,
  translateGroupName: TranslateGroupName,
  renderedSelectorsForGroup: Array<RenderedPropertySelector>,
  labels: RenderedPropertyLabels
}

export function PropertiesSelectorGroup({
  isClosedGroup,
  groupName,
  onToggleGroupClosed,
  translateGroupName,
  renderedSelectorsForGroup,
  labels
}:PropertiesSelectorGroupProps) {
  const className1 = 'group-container' + (isClosedGroup || groupName === "Main" ? ' expanded' : ' collapsed'); // temp fix to hide on start
  return (
    <div key={groupName} className={className1}>
      <div className="group-container-header" onClick={() => onToggleGroupClosed(groupName)}>
        <button className="expand-collapse">&nbsp;>>&nbsp;</button>
        {translateGroupName(groupName)}
      </div>
      {
        renderedSelectorsForGroup.map((selector) => (
            <PropertiesSelectorGroupItem key={selector.propertyName} selector={selector} label={labels[selector.propertyName]}/>
          )
        )
      }
    </div>
  );
}



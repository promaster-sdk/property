import * as React from "react";
import {PropertySelectorRow} from "./properties-selector-example-1-row";
import {PropertiesSelector} from "promaster-react";

export type TranslatePropertyLabelHover = () => string;
export type TranslateGroupName = (groupName: string) => string;
export type OnToggleGroupClosed = (groupName: string) => void;

export interface PropertiesSelectorLayoutProps {
  readonly renderedPropertySelectors: Array<PropertiesSelector.RenderedPropertySelector>,
  readonly translatePropertyLabelHover: TranslatePropertyLabelHover,
  readonly translateGroupName: TranslateGroupName,
  readonly closedGroups: Array<string>,
  readonly onToggleGroupClosed: OnToggleGroupClosed,
}

export function PropertiesSelectorLayout({
  renderedPropertySelectors,

  translatePropertyLabelHover,
  translateGroupName,
  closedGroups,
  onToggleGroupClosed,
}: PropertiesSelectorLayoutProps) {

  const groups = getGroupDistinctNames(renderedPropertySelectors);

  return (
    <div className="properties-selector">
      {
        groups.map((groupName: any) => {
          const isClosedGroup = closedGroups.indexOf(groupName) !== -1;
          const renderedSelectorsForGroup = renderedPropertySelectors.filter((selector) => selector.groupName === (groupName || ''));
          const className1 = 'group-container' + (isClosedGroup || groupName === "Main" ? ' expanded' : ' collapsed'); // temp fix to hide on start
          return (
            <div key={groupName} className={className1}>
              <div className="group-container-header"
                   onClick={ () => onToggleGroupClosed(groupName)}>
                <button className="expand-collapse">&nbsp;</button>
                {translateGroupName(groupName)}
              </div>
              {
                renderedSelectorsForGroup.map((selector) =>
                  <PropertySelectorRow key={selector.propertyName}
                                       propertyName={selector.propertyName}
                                       isHidden={selector.isHidden}
                                       renderedSelectorElement={selector.renderedSelectorElement}
                                       label={selector.label}
                                       isValid={selector.isValid}
                                       translatePropertyLabelHover={translatePropertyLabelHover}
                                       translateHiddenProperty={() => "Hidden_Property_Translation"}/>
                )
              }
            </div>
          );
        })
      }
    </div>
  );

}

function getGroupDistinctNames(productPropertiesArray: Array<PropertiesSelector.RenderedPropertySelector>): Array<string> {
  const sortedProperties = productPropertiesArray.sort((e) => e.sortNo);
  const groupNames: Array<string> = [];
  for (let property of sortedProperties) {
    if (groupNames.indexOf(property.groupName) === -1 && !isNullOrWhiteSpace(property.groupName)) {
      groupNames.push(property.groupName);
    }
  }
  return groupNames;
}

function isNullOrWhiteSpace(str: string) {
  return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, '').length < 1;
}

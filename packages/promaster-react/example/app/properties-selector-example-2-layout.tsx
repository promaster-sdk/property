import * as React from "react";
import {PropertiesSelector} from "@promaster/promaster-react";
import {Expander} from "./expander";

import {propertiesSelectorLayoutStyles as styles} from "./properties-selector-example-2-layout-styles";

export type TranslatePropertyLabelHover = (propertyName: string) => string;
export type TranslateGroupName = (groupName: string) => string;
export type OnToggleGroupClosed = (groupName: string) => void;

export interface Props {
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
}: Props): React.ReactElement<Props> {

  const groups = getGroupDistinctNames(renderedPropertySelectors);

  return (
    <div>
      {
        groups.map((groupName: string) => {
          const isClosed = closedGroups.indexOf(groupName) !== -1;
          const selectorsInGroup = renderedPropertySelectors.filter((selector) => selector.groupName === groupName);
          return (
            <Expander key={groupName} header={translateGroupName(groupName)} closed={isClosed} closedChanged={() => onToggleGroupClosed(groupName)}>
              {selectorsInGroup.map((selector) => selectorRow(selector, translatePropertyLabelHover))}
            </Expander>
          );
        })
      }
    </div>
  );

}

function selectorRow(selector: PropertiesSelector.RenderedPropertySelector,
                     translatePropertyLabelHover: TranslatePropertyLabelHover): React.ReactElement<{}> {
  const className = [
    styles.property,
    selector.isValid ? "" : styles.invalid,
    selector.isHidden ? styles.hidden : "",
  ].join(" ");
  return (
    <div key={selector.propertyName} className={className} >
      <span className={styles.label} title={translatePropertyLabelHover(selector.propertyName)}>{selector.label}</span>
      {selector.renderedSelectorElement}
    </div>
  );
}

function getGroupDistinctNames(productPropertiesArray: Array<PropertiesSelector.RenderedPropertySelector>): Array<string> {
  const groupNames: Array<string> = [];
  for (let property of productPropertiesArray) {
    if (groupNames.indexOf(property.groupName) === -1 /*&& !isNullOrWhiteSpace(property.groupName)*/) {
      groupNames.push(property.groupName); //tslint:disable-line
    }
  }
  return groupNames;
}


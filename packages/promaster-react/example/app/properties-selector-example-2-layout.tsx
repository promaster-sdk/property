import * as React from "react";
import {PropertiesSelector} from "@promaster/promaster-react";
import {Expander} from "./expander";

import {propertiesSelectorLayoutStyles as styles} from "./properties-selector-example-2-layout-styles";
import {LayoutComponentProps, ReactComponent, PropertySelectorComponentProps} from "@promaster/promaster-react/properties-selector";

export type TranslatePropertyLabelHover = (propertyName: string) => string;

export function PropertiesSelectorExample2Layout({
  selectors,
  translateGroupName,
  closedGroups,
  onToggleGroupClosed,
  PropertySelectorComponent,
}: LayoutComponentProps): React.ReactElement<LayoutComponentProps> {

  const groups = getGroupDistinctNames(selectors);

  return (
    <div>
      {
        groups.map((groupName: string) => {
          const isClosed = closedGroups.indexOf(groupName) !== -1;
          const selectorsInGroup = selectors.filter((selector) => selector.groupName === groupName);
          return (
            <Expander key={groupName} header={translateGroupName(groupName)} closed={isClosed} closedChanged={() => onToggleGroupClosed(groupName)}>
              {selectorsInGroup.map((selector) => selectorRow(selector, PropertySelectorComponent))}
            </Expander>
          );
        })
      }
    </div>
  );

}

function selectorRow(selector: PropertiesSelector.PropertySelectorRenderInfo,
                     PropertySelectorComponent: ReactComponent<PropertySelectorComponentProps>): React.ReactElement<{}> {
  const className = [
    styles.property,
    selector.isValid ? "" : styles.invalid,
    selector.isHidden ? styles.hidden : "",
  ].join(" ");
  return (
    <div key={selector.propertyName} className={className}>
      <span className={styles.label} title={selector.labelHover}>{selector.label}</span>
      <PropertySelectorComponent {...selector.selectorComponentProps}/>
    </div>
  );
}

function getGroupDistinctNames(productPropertiesArray: Array<PropertiesSelector.PropertySelectorRenderInfo>): Array<string> {
  const groupNames: Array<string> = [];
  for (let property of productPropertiesArray) {
    if (groupNames.indexOf(property.groupName) === -1 /*&& !isNullOrWhiteSpace(property.groupName)*/) {
      groupNames.push(property.groupName); //tslint:disable-line
    }
  }
  return groupNames;
}


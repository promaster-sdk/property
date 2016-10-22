import {DOM, createFactory} from "react";
import {PropertySelectorRow} from "./properties_selector_row";
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

export function propertiesSelectorLayout({
  renderedPropertySelectors,

  translatePropertyLabelHover,
  translateGroupName,
  closedGroups,
  onToggleGroupClosed,
}: PropertiesSelectorLayoutProps) {

  const groups = getGroupNames(renderedPropertySelectors);

  return DOM.div(
    {
      className: 'properties-selector'
    },
    groups.map((nameIn: any) => {
      let name = (nameIn) ? nameIn : 'Other';
      const keyValue = name;
      name = translateGroupName(name);
      const hidden = R.contains(name, closedGroups);

      const selectorsDefinitionsForGroup = renderedPropertySelectors.filter((selector) => selector.groupName === (nameIn || ''));
      // console.log("rows", rows);
      // console.log("nameIn", nameIn, "rowsForGroup", rowsForGroup);

      return DOM.div({
          key: keyValue,
          className: 'group-container' + (hidden || keyValue === "Main" ? ' expanded' : ' collapsed') // temp fix to hide on start
        },
        DOM.div({
          className: 'group-container-header',
          onClick: () => onToggleGroupClosed(name)
        }, DOM.button({className: 'expand-collapse'}, ''), name),

        selectorsDefinitionsForGroup.map((selector) => PropertySelectorRow({
          propertyName: selector.propertyName,
          isHidden: selector.isHidden,
          renderedSelectorElement: selector.renderedSelectorElement,
          label: selector.label,
          isValid: selector.isValid,
          translatePropertyLabelHover: translatePropertyLabelHover,
          translateHiddenProperty: () => "Hidden_Property_Translation",
        }))
      );
    })
  );
}

function getGroupNames(productPropertiesArray: Array<PropertiesSelector.RenderedPropertySelector>): Array<string> {
  const sortedProperties = productPropertiesArray.sort((e) => e.sortNo);
  const groupNames: Array<string> = [];
  for (let property of sortedProperties) {
    if (groupNames.indexOf(property.groupName) === -1 && ! isNullOrWhiteSpace(property.groupName)) {
      groupNames.push(property.groupName);
    }
  }
  return groupNames;
}

function isNullOrWhiteSpace(str: string) {
  return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, '').length < 1;
}

export const PropertiesSelectorLayout = createFactory(propertiesSelectorLayout);

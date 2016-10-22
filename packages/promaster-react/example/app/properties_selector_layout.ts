// import * as R from "ramda";
import {DOM, createFactory} from "react";
import {PropertySelectorRow} from "./properties_selector_row";
import {RenderedPropertySelector} from "properties-selector";

export type TranslatePropertyLabelHover = () => string;
export type TranslateGroupName = (groupName: string) => string;
export type OnToggleGroupContainer = (groupName: string) => void;

export interface PropertiesSelectorLayoutProps {
  readonly renderedPropertySelectors: Array<RenderedPropertySelector>,
  readonly translatePropertyLabelHover: TranslatePropertyLabelHover,
  readonly translateGroupName: TranslateGroupName,
  readonly closedTabs: Array<string>,
  readonly onToggleGroupContainer: OnToggleGroupContainer,
}

export function propertiesSelectorLayout({
  renderedPropertySelectors,

  translatePropertyLabelHover,
  translateGroupName,
  closedTabs,
  onToggleGroupContainer,
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
      const hidden = R.contains(name, closedTabs);

      const selectorsDefinitionsForGroup = renderedPropertySelectors.filter((selector) => selector.groupName === (nameIn || ''));
      // console.log("rows", rows);
      // console.log("nameIn", nameIn, "rowsForGroup", rowsForGroup);

      return DOM.div({
          key: keyValue,
          className: 'group-container' + (hidden || keyValue === "Main" ? ' expanded' : ' collapsed') // temp fix to hide on start
        },
        DOM.div({
          className: 'group-container-header',
          onClick: () => onToggleGroupContainer(name)
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

function getGroupNames(productPropertiesArray: Array<RenderedPropertySelector>): Array<string> {

  const productPropertiesArray2 = R.sortBy((selector) => selector.sortNo, productPropertiesArray);
  const productPropertiesArray3 = R.uniqBy((selector) => selector.groupName, productPropertiesArray2);
  const groupNames = productPropertiesArray3.map((p) => isNullOrWhiteSpace(p.groupName) ? undefined : p.groupName);
  return groupNames;
}

function isNullOrWhiteSpace(str: string) {
  return str === null || str === undefined || str.length < 1 || str.replace(/\s/g, '').length < 1;
}

export const PropertiesSelectorLayout = createFactory(propertiesSelectorLayout);

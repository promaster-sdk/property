import * as R from "ramda";
import {DOM, createFactory} from "react";
import {PropertySelectorRow} from "../components/properties_selector_row";
import {RenderedPropertySelector} from "properties-selector";
import {OnPropertyOverrideChange} from "./types";
import {IntlApi} from "../../intl/index";
import {ProductId} from "../../product_data/types";

export type TranslatePropertyLabelHover = (productId: ProductId) => string;
export type OnToggleGroupContainer = (productId: ProductId, groupName: string) => void;

export interface PropertiesSelectorLayoutProps {
	readonly renderedPropertySelectors: Array<RenderedPropertySelector>,
	readonly translatePropertyLabelHover: TranslatePropertyLabelHover,
	readonly hiddenTabs: Array<string>,
	readonly onToggleGroupContainer: OnToggleGroupContainer,
	readonly intl: IntlApi,
	readonly explicitLabels?: Map<string, string>,
	readonly calculatedProperties: Set<string>,
	readonly overridableProperties: Array<string>,
	readonly overriddenProperties: Array<string>,
	readonly onPropertyOverrideChange: OnPropertyOverrideChange,
	readonly productId: ProductId,
}

export function propertiesSelectorLayout({
	renderedPropertySelectors,
	productId,

	translatePropertyLabelHover,
	hiddenTabs,
	onToggleGroupContainer,
	intl,
	explicitLabels,
	calculatedProperties,
	overridableProperties,
	overriddenProperties,
	onPropertyOverrideChange,
}: PropertiesSelectorLayoutProps) {

	const groups = getGroupNames(renderedPropertySelectors);

	return DOM.div(
		{
			className: 'properties-selector'
		},
		groups.map((nameIn: any) => {
			let name = (nameIn) ? nameIn : 'Other';
			const keyValue = name;
			name = intl.texts.properties_selector_group_name(name);
			const hidden = R.contains(name, hiddenTabs);

			const selectorsDefinitionsForGroup = renderedPropertySelectors.filter((selector) => selector.groupName === (nameIn || ''));
			// console.log("rows", rows);
			// console.log("nameIn", nameIn, "rowsForGroup", rowsForGroup);

			return DOM.div({
					key: keyValue,
					className: 'group-container' + (hidden || keyValue === "Main" ? ' expanded' : ' collapsed') // temp fix to hide on start
				},
				DOM.div({
					className: 'group-container-header',
					onClick: () => onToggleGroupContainer(productId, name)
				}, DOM.button({className: 'expand-collapse'}, ''), name),

				selectorsDefinitionsForGroup.map((selector) => PropertySelectorRow({

					propertyName: selector.propertyName,
					isHidden: selector.isHidden,
					renderedSelectorElement: selector.renderedSelectorElement,
					label: explicitLabels && explicitLabels.has(selector.propertyName)
						? explicitLabels.get(selector.propertyName)
						: selector.label,
					isValid: selector.isValid,
					translatePropertyLabelHover: translatePropertyLabelHover,
					intl: intl,

					onPropertyOverrideChange: onPropertyOverrideChange,
					calculated: calculatedProperties.has(selector.propertyName),
					overridable: overridableProperties.indexOf(selector.propertyName) >= 0 || false,
					overridden: overriddenProperties
					&& (typeof overriddenProperties.indexOf === 'function')
					&& overriddenProperties.indexOf(selector.propertyName) >= 0,


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

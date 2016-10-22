import {DOM, SyntheticEvent, createFactory} from "react";
import {IntlApi} from "../../intl/index";
import {OnPropertyOverrideChange} from "./types";

export interface PropertySelectorRowProps {
	readonly key?: string,
	readonly propertyName: string,
	readonly isHidden: boolean,
	readonly onPropertyOverrideChange: OnPropertyOverrideChange,
	readonly calculated: boolean,
	readonly overridable: boolean,
	readonly overridden: boolean,
	readonly intl: IntlApi,
	readonly label: string,
	readonly translatePropertyLabelHover: (propertyName:string) => string,
	readonly isValid:boolean,
	readonly renderedSelectorElement: any,
}

function propertySelectorRow({
	propertyName,
	isHidden,
	onPropertyOverrideChange,
	calculated,
	overridable,
	overridden,
	intl,
	label,
	translatePropertyLabelHover,
	isValid,
	renderedSelectorElement,
}:PropertySelectorRowProps) {

	return DOM.div({className: 'property-selector-row'},
		DOM.label(
			{
				className: !isValid
					? 'invalid'
					: undefined,
				title: translatePropertyLabelHover(propertyName)
			},
			calculated && overridable ?
				DOM.input({
					type: 'checkbox',
					checked: overridden,
					onChange: (e: SyntheticEvent<any>) =>
					onPropertyOverrideChange && onPropertyOverrideChange(propertyName, (<HTMLInputElement>(e.target)).checked)
				})
				: undefined
			,
			(isHidden
					? DOM.span(
					{
						className: "hidden-property"
					},
					`(${intl.texts.property_selector_hidden_property()}) `
				)
					: null
			),
			label
		),
		renderedSelectorElement
	);


}

export const PropertySelectorRow = createFactory(propertySelectorRow);

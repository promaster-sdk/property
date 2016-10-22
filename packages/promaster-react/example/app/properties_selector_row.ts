import {DOM, createFactory} from "react";
import {IntlApi} from "../../intl/index";
import {OnPropertyOverrideChange} from "./types";

export type TranslateHiddenProperty = () => string;

export interface PropertySelectorRowProps {
	readonly key?: string,
	readonly propertyName: string,
	readonly isHidden: boolean,
	readonly label: string,
	readonly translatePropertyLabelHover: (propertyName:string) => string,
	readonly isValid:boolean,
	readonly renderedSelectorElement: any,
  readonly translateHiddenProperty: TranslateHiddenProperty
}

function propertySelectorRow({
	propertyName,
	isHidden,
	label,
	translatePropertyLabelHover,
	isValid,
	renderedSelectorElement,
  translateHiddenProperty
}:PropertySelectorRowProps) {

	return DOM.div({className: 'property-selector-row'},
		DOM.label(
			{
				className: !isValid
					? 'invalid'
					: undefined,
				title: translatePropertyLabelHover(propertyName)
			},
			(isHidden
					? DOM.span(
					{
						className: "hidden-property"
					},
					`(${translateHiddenProperty()}) `
				)
					: null
			),
			label
		),
		renderedSelectorElement
	);


}

export const PropertySelectorRow = createFactory(propertySelectorRow);

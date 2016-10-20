import * as React from "react";
import {Amount, PropertyValueSet, PropertyFilter, PropertyValue, Unit, PropertyType} from "promaster-primitives";
import {FilterPrettyPrint} from "promaster-portable/lib/property_filtering";
import {AmountInputBox, AmountFormatSelector, OnFormatChanged,
	AmountFormatSelectorClassNames, AmountInputBoxClassNames} from "../amount-fields";

export interface AmountPropertySelectorProps {
	readonly propertyName:string,
	readonly propertyValueSet:PropertyValueSet,
	readonly inputUnit:Unit<any>,
	readonly inputDecimalCount:number,
	readonly validationFilter:PropertyFilter,
	readonly notNumericMessage:string,
	readonly isRequiredMessage:string,
	readonly filterPrettyPrint:FilterPrettyPrint,
	readonly readOnly:boolean,
	readonly onFormatChanged:OnFormatChanged,
	readonly onValueChange:(newValue: PropertyValue | null) => void,
    readonly classNames: AmountPropertySelectorClassNames,
}

export interface AmountPropertySelectorClassNames {
    readonly amount: string,
    readonly amountFormatSelectorClassNames: AmountFormatSelectorClassNames,
    readonly amountInputBoxClassNames: AmountInputBoxClassNames,
}

export class AmountPropertySelector extends React.Component<AmountPropertySelectorProps, any> {

	render() {

		const {onValueChange, onFormatChanged, notNumericMessage, isRequiredMessage,
			validationFilter, propertyValueSet, propertyName, filterPrettyPrint, inputUnit,
            inputDecimalCount, readOnly, classNames} = this.props;

		const value: Amount<any> = propertyValueSet.getAmount(propertyName);

        return (
			<span className={classNames.amount}>
				<AmountInputBox value={value}
								inputUnit={inputUnit}
								inputDecimalCount={inputDecimalCount}
								notNumericMessage={notNumericMessage}
								isRequiredMessage={isRequiredMessage}
								errorMessage={_getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint)}
								readOnly={readOnly}
								onValueChange={(newAmount) =>
								onValueChange(newAmount !== null ? new PropertyValue(PropertyType.Amount, newAmount): null)}
                                classNames={classNames.amountInputBoxClassNames} />
				<AmountFormatSelector selectedUnit={inputUnit}
                                      selectedDecimalCount={inputDecimalCount}
                                      onFormatChanged={onFormatChanged}
                                      classNames={classNames.amountFormatSelectorClassNames} />
			</span>
		);

	}

}

function _getValidationMessage(propertyValueSet:PropertyValueSet,
															 value:Amount<any>,
															 validationFilter:PropertyFilter,
															 filterPrettyPrint:FilterPrettyPrint) {
	if (!value || !validationFilter) {
		return '';
	}

	if (validationFilter.isValid(propertyValueSet)) {
		return '';
	}
	else {
		return filterPrettyPrint(validationFilter);
	}
}

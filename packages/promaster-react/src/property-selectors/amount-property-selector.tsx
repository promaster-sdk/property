import * as React from "react";
import {Amount, PropertyValueSet, PropertyFilter, PropertyValue, Unit} from "promaster-primitives";
import {PropertyFiltering} from "promaster-portable";
import {
    AmountInputBox, AmountFormatSelector, OnFormatChanged,
    AmountFormatSelectorClassNames, AmountInputBoxClassNames
} from "../amount-fields";

export interface AmountPropertySelectorProps {
    readonly propertyName: string,
    readonly propertyValueSet: PropertyValueSet.PropertyValueSet,
    readonly inputUnit: Unit.Unit<any>,
    readonly inputDecimalCount: number,
    readonly validationFilter: PropertyFilter.PropertyFilter,
    readonly notNumericMessage: string,
    readonly isRequiredMessage: string,
    readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
    readonly readOnly: boolean,
    readonly onFormatChanged: OnFormatChanged,
    readonly onValueChange: (newValue: PropertyValue.PropertyValue | null) => void,
    readonly classNames: AmountPropertySelectorClassNames,
}

export interface AmountPropertySelectorClassNames {
    readonly amount: string,
    readonly amountFormatSelectorClassNames: AmountFormatSelectorClassNames,
    readonly amountInputBoxClassNames: AmountInputBoxClassNames,
}

export class AmountPropertySelector extends React.Component<AmountPropertySelectorProps, any> {

    render() {

        const {
            onValueChange, onFormatChanged, notNumericMessage, isRequiredMessage,
            validationFilter, propertyValueSet, propertyName, filterPrettyPrint, inputUnit,
            inputDecimalCount, readOnly, classNames
        } = this.props;

        const value: Amount.Amount<any> = PropertyValueSet.getAmount(propertyName, propertyValueSet);

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
								onValueChange(newAmount !== null ? PropertyValue.create("amount", newAmount): null)}
                                classNames={classNames.amountInputBoxClassNames}/>
				<AmountFormatSelector selectedUnit={inputUnit}
                                      selectedDecimalCount={inputDecimalCount}
                                      onFormatChanged={onFormatChanged}
                                      classNames={classNames.amountFormatSelectorClassNames}/>
			</span>
        );

    }

}

function _getValidationMessage(propertyValueSet: PropertyValueSet.PropertyValueSet,
                               value: Amount.Amount<any>,
                               validationFilter: PropertyFilter.PropertyFilter,
                               filterPrettyPrint: FilterPrettyPrint) {
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

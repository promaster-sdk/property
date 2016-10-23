import * as React from "react";
import { PropertyValueSet, PropertyFilter, PropertyValue } from "promaster-primitives";
import { AmountInputBox, AmountFormatSelector } from "../amount-fields/index";
export class AmountPropertySelector extends React.Component {
    render() {
        const { onValueChange, onFormatChanged, notNumericMessage, isRequiredMessage, validationFilter, propertyValueSet, propertyName, filterPrettyPrint, inputUnit, inputDecimalCount, readOnly, classNames } = this.props;
        const value = PropertyValueSet.getAmount(propertyName, propertyValueSet);
        if (!value)
            throw new Error("Value is undefined");
        return (React.createElement("span", {className: classNames.amount}, 
            React.createElement(AmountInputBox, {value: value, inputUnit: inputUnit, inputDecimalCount: inputDecimalCount, notNumericMessage: notNumericMessage, isRequiredMessage: isRequiredMessage, errorMessage: _getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint), readOnly: readOnly, onValueChange: (newAmount) => onValueChange(newAmount !== null ? PropertyValue.create("amount", newAmount) : null), classNames: classNames.amountInputBoxClassNames}), 
            React.createElement(AmountFormatSelector, {selectedUnit: inputUnit, selectedDecimalCount: inputDecimalCount, onFormatChanged: onFormatChanged, classNames: classNames.amountFormatSelectorClassNames})));
    }
}
function _getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint) {
    if (!value || !validationFilter) {
        return '';
    }
    if (PropertyFilter.isValid(propertyValueSet, validationFilter)) {
        return '';
    }
    else {
        return filterPrettyPrint(validationFilter);
    }
}

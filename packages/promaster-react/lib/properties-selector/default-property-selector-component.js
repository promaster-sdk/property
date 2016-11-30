"use strict";
var React = require("react");
var promaster_primitives_1 = require("@promaster/promaster-primitives");
var index_1 = require("../property-selectors/index");
var amountPropertySelector = React.createFactory(index_1.AmountPropertySelector);
var comboboxPropertySelector = React.createFactory(index_1.ComboboxPropertySelector);
var textboxPropertySelector = React.createFactory(index_1.TextboxPropertySelector);
function DefaultPropertySelectorComponent(_a) {
    var propertyName = _a.propertyName, quantity = _a.quantity, validationFilter = _a.validationFilter, valueItems = _a.valueItems, selectedValue = _a.selectedValue, selectedProperties = _a.selectedProperties, includeCodes = _a.includeCodes, optionalProperties = _a.optionalProperties, onChange = _a.onChange, onPropertyFormatChanged = _a.onPropertyFormatChanged, filterPrettyPrint = _a.filterPrettyPrint, propertyFormat = _a.propertyFormat, readOnly = _a.readOnly, locked = _a.locked, translatePropertyValue = _a.translatePropertyValue, translateValueMustBeNumericMessage = _a.translateValueMustBeNumericMessage, translateValueIsRequiredMessage = _a.translateValueIsRequiredMessage, styles = _a.styles;
    function onValueChange(newValue) {
        onChange(newValue
            ? promaster_primitives_1.PropertyValueSet.set(propertyName, newValue, selectedProperties)
            : promaster_primitives_1.PropertyValueSet.removeProperty(propertyName, selectedProperties));
    }
    switch (getPropertyType(quantity)) {
        case "text":
            var value = selectedValue && promaster_primitives_1.PropertyValue.getText(selectedValue);
            if (value === undefined)
                throw new Error("No value!");
            return textboxPropertySelector({
                value: value,
                readOnly: readOnly,
                onValueChange: onValueChange,
                styles: styles.textboxPropertySelectorStyles
            });
        case "integer": {
            return comboboxPropertySelector({
                sortValidFirst: true,
                propertyName: propertyName,
                propertyValueSet: selectedProperties,
                valueItems: valueItems && valueItems.map(function (vi) { return ({
                    value: vi.value,
                    text: translatePropertyValue(propertyName, (vi.value ? promaster_primitives_1.PropertyValue.getInteger(vi.value) : undefined)),
                    sortNo: vi.sortNo,
                    validationFilter: vi.validationFilter,
                    image: vi.image,
                }); }),
                showCodes: includeCodes,
                filterPrettyPrint: filterPrettyPrint,
                onValueChange: onValueChange,
                readOnly: readOnly,
                locked: locked,
                styles: styles.comboboxPropertySelectorStyles
            });
        }
        default:
            return amountPropertySelector({
                propertyName: propertyName,
                propertyValueSet: selectedProperties,
                inputUnit: propertyFormat.unit,
                inputDecimalCount: propertyFormat.decimalCount,
                onFormatChanged: function (unit, decimalCount) { return onPropertyFormatChanged(propertyName, unit, decimalCount); },
                onValueChange: onValueChange,
                notNumericMessage: translateValueMustBeNumericMessage(),
                isRequiredMessage: optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : translateValueIsRequiredMessage(),
                validationFilter: validationFilter,
                filterPrettyPrint: filterPrettyPrint,
                readOnly: readOnly,
                styles: styles.amountPropertySelectorStyles
            });
    }
}
exports.DefaultPropertySelectorComponent = DefaultPropertySelectorComponent;
function getPropertyType(quantity) {
    switch (quantity) {
        case "Text":
            return "text";
        case "Discrete":
            return "integer";
        default:
            return "amount";
    }
}
//# sourceMappingURL=default-property-selector-component.js.map
"use strict";
var React = require("react");
var promaster_primitives_1 = require("@promaster/promaster-primitives");
var index_1 = require("../property-selectors/index");
var amountPropertySelector = React.createFactory(index_1.AmountPropertySelector);
var comboboxPropertySelector = React.createFactory(index_1.ComboboxPropertySelector);
var textboxPropertySelector = React.createFactory(index_1.TextboxPropertySelector);
function renderPropertySelectors(_a) {
    var productProperties = _a.productProperties, selectedProperties = _a.selectedProperties, filterPrettyPrint = _a.filterPrettyPrint, includeCodes = _a.includeCodes, includeHiddenProperties = _a.includeHiddenProperties, autoSelectSingleValidValue = _a.autoSelectSingleValidValue, onChange = _a.onChange, onPropertyFormatChanged = _a.onPropertyFormatChanged, translatePropertyName = _a.translatePropertyName, translatePropertyValue = _a.translatePropertyValue, translateValueMustBeNumericMessage = _a.translateValueMustBeNumericMessage, translateValueIsRequiredMessage = _a.translateValueIsRequiredMessage, readOnlyProperties = _a.readOnlyProperties, optionalProperties = _a.optionalProperties, propertyFormats = _a.propertyFormats, styles = _a.styles;
    autoSelectSingleValidValue = (autoSelectSingleValidValue === null || autoSelectSingleValidValue === undefined) ? true : autoSelectSingleValidValue;
    var sortedArray = productProperties.slice().sort(function (a, b) { return a.sortNo < b.sortNo ? -1 : a.sortNo > b.sortNo ? 1 : 0; });
    var selectorDefinitions = sortedArray
        .filter(function (property) { return includeHiddenProperties || promaster_primitives_1.PropertyFilter.isValid(selectedProperties, property.visibilityFilter); })
        .map(function (property) {
        var selectedValue = promaster_primitives_1.PropertyValueSet.getValue(property.name, selectedProperties);
        var selectedValueItem = property.valueItems && property.valueItems
            .find(function (value) {
            return (value.value === undefined && selectedValue === undefined) || (value.value && promaster_primitives_1.PropertyValue.equals(selectedValue, value.value));
        });
        var isValid;
        var defaultFormat = { unit: promaster_primitives_1.Units.One, decimalCount: 2 };
        switch (getPropertyType(property.quantity)) {
            case "integer":
                isValid = selectedValueItem ? promaster_primitives_1.PropertyFilter.isValid(selectedProperties, selectedValueItem.validationFilter) : false;
                break;
            case "amount":
                defaultFormat = selectedValue && selectedValue.type === "amount" ?
                    { unit: selectedValue.value.unit, decimalCount: selectedValue.value.decimalCount } : defaultFormat;
                isValid = property.validationFilter && promaster_primitives_1.PropertyFilter.isValid(selectedProperties, property.validationFilter);
                break;
            default:
                isValid = true;
        }
        var isReadOnly = readOnlyProperties.indexOf(property.name) !== -1;
        var propertyFormat = propertyFormats[property.name] || defaultFormat;
        return {
            sortNo: property.sortNo,
            propertyName: property.name,
            groupName: property.group,
            isValid: isValid,
            isHidden: !promaster_primitives_1.PropertyFilter.isValid(selectedProperties, property.visibilityFilter),
            label: translatePropertyName(property.name) + (includeCodes ? ' (' + property.name + ')' : ''),
            renderedSelectorElement: renderPropertySelector(property.name, property.quantity, property.validationFilter, property.valueItems, selectedValue, selectedProperties, includeCodes, optionalProperties, handleChange(onChange, productProperties, autoSelectSingleValidValue), onPropertyFormatChanged, filterPrettyPrint, propertyFormat, isReadOnly, autoSelectSingleValidValue
                ? !!getSingleValidValueOrUndefined(property, selectedProperties)
                : false, translatePropertyValue, translateValueMustBeNumericMessage, translateValueIsRequiredMessage, styles)
        };
    });
    return selectorDefinitions;
}
exports.renderPropertySelectors = renderPropertySelectors;
function renderPropertySelector(propertyName, quantity, validationFilter, valueItems, selectedValue, selectedProperties, includeCodes, optionalProperties, onChange, onPropertyFormatChanged, filterPrettyPrint, propertyFormat, readOnly, locked, translatePropertyValue, translateNotNumericMessage, translateValueIsRequiredMessage, styles) {
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
                notNumericMessage: translateNotNumericMessage(),
                isRequiredMessage: optionalProperties && optionalProperties.indexOf(propertyName) !== -1 ? "" : translateValueIsRequiredMessage(),
                validationFilter: validationFilter,
                filterPrettyPrint: filterPrettyPrint,
                readOnly: readOnly,
                styles: styles.amountPropertySelectorStyles
            });
    }
}
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
function getSingleValidValueOrUndefined(productProperty, properties) {
    if (productProperty.quantity === "Discrete") {
        var validPropertyValueItems = [];
        for (var _i = 0, _a = productProperty.valueItems; _i < _a.length; _i++) {
            var productValueItem = _a[_i];
            var isValid = promaster_primitives_1.PropertyFilter.isValid(properties, productValueItem.validationFilter);
            if (isValid) {
                validPropertyValueItems.push(productValueItem);
            }
        }
        return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : undefined;
    }
    return undefined;
}
function handleChange(externalOnChange, productProperties, autoSelectSingleValidValue) {
    return function (properties) {
        if (!autoSelectSingleValidValue) {
            externalOnChange(properties);
            return;
        }
        var lastProperties = properties;
        for (var i = 0; i < 4; i++) {
            for (var _i = 0, productProperties_1 = productProperties; _i < productProperties_1.length; _i++) {
                var productProperty = productProperties_1[_i];
                var propertyValueItem = getSingleValidValueOrUndefined(productProperty, properties);
                if (propertyValueItem) {
                    properties = promaster_primitives_1.PropertyValueSet.set(productProperty.name, propertyValueItem.value, properties);
                }
            }
            if (properties === lastProperties) {
                break;
            }
            lastProperties = properties;
        }
        externalOnChange(properties);
    };
}
//# sourceMappingURL=render-property-selectors.js.map
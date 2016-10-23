import * as React from "react";
import { Units, PropertyValueSet, PropertyValue, PropertyFilter } from "promaster-primitives";
import { ComboboxPropertySelector, TextboxPropertySelector, AmountPropertySelector } from "../property-selectors/index";
const amountPropertySelector = React.createFactory(AmountPropertySelector);
const comboboxPropertySelector = React.createFactory(ComboboxPropertySelector);
const textboxPropertySelector = React.createFactory(TextboxPropertySelector);
export function renderPropertySelectors({ productProperties, selectedProperties, filterPrettyPrint, includeCodes, includeHiddenProperties, autoSelectSingleValidValue, onChange, onPropertyFormatChanged, translatePropertyName, translatePropertyValue, translateValueMustBeNumericMessage, translateValueIsRequiredMessage, readOnlyProperties, optionalProperties, inputFormats, classNames, }) {
    autoSelectSingleValidValue = (autoSelectSingleValidValue === null || autoSelectSingleValidValue === undefined) ? true : autoSelectSingleValidValue;
    const sortedArray = productProperties.slice().sort((a, b) => a.sortNo < b.sortNo ? -1 : a.sortNo > b.sortNo ? 1 : 0);
    const selectorDefinitions = sortedArray
        .filter((property) => includeHiddenProperties || PropertyFilter.isValid(selectedProperties, property.visibilityFilter))
        .map((property) => {
        const selectedValue = PropertyValueSet.getValue(property.name, selectedProperties);
        const selectedValueItem = property.valueItems && property.valueItems
            .find((value) => (value.value === null && selectedValue === null) || (value.value && PropertyValue.equals(selectedValue, value.value)));
        let isValid;
        switch (getPropertyType(property.quantity)) {
            case "integer":
                isValid = selectedValueItem ? PropertyFilter.isValid(selectedProperties, selectedValueItem.validationFilter) : false;
                break;
            case "amount":
                isValid = property.validationFilter && PropertyFilter.isValid(selectedProperties, property.validationFilter);
                break;
            default:
                isValid = true;
        }
        const isReadOnly = readOnlyProperties.has(property.name);
        const inputFormat = inputFormats.get(property.name) || { unit: Units.One, decimalCount: 2 };
        return {
            sortNo: property.sortNo,
            propertyName: property.name,
            groupName: property.group,
            isValid: isValid,
            isHidden: !PropertyFilter.isValid(selectedProperties, property.visibilityFilter),
            label: translatePropertyName(property.name) + (includeCodes ? ' (' + property.name + ')' : ''),
            renderedSelectorElement: renderPropertySelector(property.name, property.quantity, property.validationFilter, property.valueItems, selectedValue, selectedProperties, includeCodes, optionalProperties, handleChange(onChange, productProperties, autoSelectSingleValidValue), onPropertyFormatChanged, filterPrettyPrint, inputFormat, isReadOnly, autoSelectSingleValidValue
                ? !!getSingleValidValueOrNull(property, selectedProperties)
                : false, translatePropertyValue, translateValueMustBeNumericMessage, translateValueIsRequiredMessage, classNames)
        };
    });
    return selectorDefinitions;
}
function renderPropertySelector(propertyName, quantity, validationFilter, valueItems, selectedValue, selectedProperties, includeCodes, optionalProperties, onChange, onPropertyFormatChanged, filterPrettyPrint, inputFormat, readOnly, locked, translatePropertyValue, translateNotNumericMessage, translateValueIsRequiredMessage, classNames) {
    function onValueChange(newValue) {
        onChange(newValue
            ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
            : PropertyValueSet.removeProperty(propertyName, selectedProperties));
    }
    switch (getPropertyType(quantity)) {
        case "text":
            const value = selectedValue && PropertyValue.getText(selectedValue);
            if (!value)
                throw new Error("No value!");
            return textboxPropertySelector({
                value: value,
                readOnly: readOnly,
                onValueChange: onValueChange
            });
        case "integer": {
            return comboboxPropertySelector({
                sortValidFirst: true,
                propertyName: propertyName,
                propertyValueSet: selectedProperties,
                valueItems: valueItems && valueItems.map((vi) => ({
                    value: vi.value,
                    text: translatePropertyValue(propertyName, (vi.value ? PropertyValue.getInteger(vi.value) : null)),
                    sortNo: vi.sortNo,
                    validationFilter: vi.validationFilter
                })),
                showCodes: includeCodes,
                filterPrettyPrint: filterPrettyPrint,
                onValueChange: onValueChange,
                readOnly: readOnly,
                locked: locked,
                classNames: classNames.comboboxPropertySelectorClassNames
            });
        }
        default:
            return amountPropertySelector({
                propertyName: propertyName,
                propertyValueSet: selectedProperties,
                inputUnit: inputFormat.unit,
                inputDecimalCount: inputFormat.decimalCount,
                onFormatChanged: (unit, decimalCount) => onPropertyFormatChanged(propertyName, unit, decimalCount),
                onValueChange: onValueChange,
                notNumericMessage: translateNotNumericMessage(),
                isRequiredMessage: optionalProperties && optionalProperties.has(propertyName) ? "" : translateValueIsRequiredMessage(),
                validationFilter: validationFilter,
                filterPrettyPrint: filterPrettyPrint,
                readOnly: readOnly,
                classNames: classNames.amountPropertySelectorClassNames
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
function getSingleValidValueOrNull(productProperty, properties) {
    if (productProperty.quantity === "Discrete") {
        const validPropertyValueItems = [];
        for (let productValueItem of productProperty.valueItems) {
            const isValid = PropertyFilter.isValid(properties, productValueItem.validationFilter);
            if (isValid) {
                validPropertyValueItems.push(productValueItem);
            }
        }
        return validPropertyValueItems.length === 1 ? validPropertyValueItems[0] : null;
    }
    return null;
}
function handleChange(externalOnChange, productProperties, autoSelectSingleValidValue) {
    return (properties) => {
        if (!autoSelectSingleValidValue) {
            externalOnChange(properties);
            return;
        }
        let lastProperties = properties;
        for (let i = 0; i < 4; i++) {
            for (let productProperty of productProperties) {
                const propertyValueItem = getSingleValidValueOrNull(productProperty, properties);
                if (propertyValueItem) {
                    properties = PropertyValueSet.set(productProperty.name, propertyValueItem.value, properties);
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

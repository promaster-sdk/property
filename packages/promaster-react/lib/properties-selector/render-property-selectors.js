"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require("react");
var promaster_primitives_1 = require("@promaster/promaster-primitives");
var render_property_selector_component_1 = require("./render-property-selector-component");
var render_property_label_component_1 = require("./render-property-label-component");
function renderPropertySelectors(_a) {
    var productProperties = _a.productProperties, selectedProperties = _a.selectedProperties, filterPrettyPrint = _a.filterPrettyPrint, includeCodes = _a.includeCodes, includeHiddenProperties = _a.includeHiddenProperties, autoSelectSingleValidValue = _a.autoSelectSingleValidValue, onChange = _a.onChange, onPropertyFormatChanged = _a.onPropertyFormatChanged, translatePropertyName = _a.translatePropertyName, translatePropertyValue = _a.translatePropertyValue, translateValueMustBeNumericMessage = _a.translateValueMustBeNumericMessage, translateValueIsRequiredMessage = _a.translateValueIsRequiredMessage, translatePropertyLabelHover = _a.translatePropertyLabelHover, readOnlyProperties = _a.readOnlyProperties, optionalProperties = _a.optionalProperties, propertyFormats = _a.propertyFormats, styles = _a.styles;
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
        var isHidden = !promaster_primitives_1.PropertyFilter.isValid(selectedProperties, property.visibilityFilter);
        var label = translatePropertyName(property.name) + (includeCodes ? ' (' + property.name + ')' : '');
        var renderPropertySelectorComponentProps = {
            propertyName: property.name,
            quantity: property.quantity,
            validationFilter: property.validationFilter,
            valueItems: property.valueItems,
            selectedValue: selectedValue,
            selectedProperties: selectedProperties,
            includeCodes: includeCodes,
            optionalProperties: optionalProperties,
            onChange: handleChange(onChange, productProperties, autoSelectSingleValidValue),
            onPropertyFormatChanged: onPropertyFormatChanged,
            filterPrettyPrint: filterPrettyPrint,
            propertyFormat: propertyFormat,
            readOnly: isReadOnly,
            locked: autoSelectSingleValidValue
                ? !!getSingleValidValueOrUndefined(property, selectedProperties)
                : false,
            translatePropertyValue: translatePropertyValue,
            translateValueMustBeNumericMessage: translateValueMustBeNumericMessage,
            translateValueIsRequiredMessage: translateValueIsRequiredMessage,
            styles: styles
        };
        var renderPropertyLabelComponentProps = {
            propertyName: property.name,
            selectorIsValid: isValid,
            selectorIsHidden: isHidden,
            selectorLabel: label,
            translatePropertyLabelHover: translatePropertyLabelHover,
        };
        return {
            sortNo: property.sortNo,
            propertyName: property.name,
            groupName: property.group,
            isValid: isValid,
            isHidden: isHidden,
            label: label,
            renderedSelectorElement: React.createElement(render_property_selector_component_1.RenderPropertySelectorComponent, __assign({}, renderPropertySelectorComponentProps)),
            renderedLabelElement: React.createElement(render_property_label_component_1.RenderPropertyLabelComponent, __assign({}, renderPropertyLabelComponentProps)),
        };
    });
    return selectorDefinitions;
}
exports.renderPropertySelectors = renderPropertySelectors;
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
"use strict";
var React = require("react");
var promaster_primitives_1 = require("promaster-primitives");
function ComboboxPropertySelector(_a) {
    var sortValidFirst = _a.sortValidFirst, propertyName = _a.propertyName, propertyValueSet = _a.propertyValueSet, valueItems = _a.valueItems, showCodes = _a.showCodes, onValueChange = _a.onValueChange, filterPrettyPrint = _a.filterPrettyPrint, readOnly = _a.readOnly, locked = _a.locked, classNames = _a.classNames;
    var value = promaster_primitives_1.PropertyValueSet.getInteger(propertyName, propertyValueSet);
    if (!valueItems)
        valueItems = [];
    var selectedValueItemOrUndefined = valueItems.find(function (item) { return (item.value && promaster_primitives_1.PropertyValue.getInteger(item.value)) === value; });
    var selectedValueItem;
    if (!selectedValueItemOrUndefined) {
        selectedValueItem = {
            value: null,
            sortNo: -1,
            text: value == null ? "" : value.toString(),
            validationFilter: promaster_primitives_1.PropertyFilter.Empty
        };
        valueItems = [selectedValueItem].concat(valueItems);
    }
    else {
        selectedValueItem = selectedValueItemOrUndefined;
    }
    var options = valueItems
        .map(function (valueItem) {
        var isItemValid = _isValueItemValid(propertyName, propertyValueSet, valueItem);
        return {
            value: _getItemValue(valueItem),
            label: _getItemLabel(valueItem, showCodes),
            isItemValid: isItemValid,
            sortNo: valueItem.sortNo,
            toolTip: isItemValid ? "" : _getItemInvalidMessage(valueItem, filterPrettyPrint)
        };
    }).sort(function (a, b) {
        if (a.sortNo < b.sortNo) {
            return -1;
        }
        if (a.sortNo > b.sortNo) {
            return 1;
        }
        return 0;
    }).sort(function (a, b) {
        if (!sortValidFirst) {
            return 0;
        }
        if (a.isItemValid && !b.isItemValid) {
            return -1;
        }
        if (!a.isItemValid && b.isItemValid) {
            return 1;
        }
        return 0;
    });
    var selectedOption = options.find(function (option) { return option.value === _getItemValue(selectedValueItem); });
    if (!selectedOption)
        throw new Error("Could not find..");
    var selectClassName;
    if (!selectedOption.isItemValid && locked) {
        selectClassName = classNames.selectInvalidLocked;
    }
    else if (!selectedOption.isItemValid) {
        selectClassName = classNames.selectInvalid;
    }
    else if (locked) {
        selectClassName = classNames.selectLocked;
    }
    else {
        selectClassName = classNames.select;
    }
    return (React.createElement("select", {className: selectClassName, disabled: readOnly || locked, value: selectedOption.value, title: selectedOption.toolTip, onChange: function (event) { return _doOnChange(event.target.value, onValueChange); }}, options.map(function (option) { return (React.createElement("option", {key: option.value, value: option.value, title: option.toolTip, className: option.isItemValid ? classNames.option : classNames.optionInvalid}, (option.isItemValid ? '' : '✘ ') + option.label)); })));
}
exports.ComboboxPropertySelector = ComboboxPropertySelector;
function _getItemLabel(valueItem, showCodes) {
    return valueItem.text + (showCodes ? " (" + (valueItem.value !== null ? promaster_primitives_1.PropertyValue.toString(valueItem.value) : "null") + ")" : '');
}
function _doOnChange(newValue, onValueChange) {
    if (newValue === "") {
        onValueChange(null);
    }
    else {
        onValueChange(promaster_primitives_1.PropertyValue.create("integer", parseInt(newValue)));
    }
}
function _getItemValue(valueItem) {
    return valueItem.value == null ? "" : promaster_primitives_1.PropertyValue.toString(valueItem.value);
}
function _getItemInvalidMessage(valueItem, filterPrettyPrint) {
    return filterPrettyPrint(valueItem.validationFilter);
}
function _isValueItemValid(propertyName, propertyValueSet, valueItem) {
    if (valueItem.value === null)
        return true;
    var pvsToCheck = promaster_primitives_1.PropertyValueSet.set(propertyName, valueItem.value, propertyValueSet);
    if (!valueItem.validationFilter)
        return true;
    return promaster_primitives_1.PropertyFilter.isValid(pvsToCheck, valueItem.validationFilter);
}
//# sourceMappingURL=combobox-property-selector.js.map
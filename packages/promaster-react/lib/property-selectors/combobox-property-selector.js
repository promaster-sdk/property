"use strict";
var React = require("react");
var promaster_primitives_1 = require("promaster-primitives");
var csjs_1 = require("csjs");
var react_csjs_1 = require("react-csjs");
console.log("withStyles", react_csjs_1.default);
var styles2 = (_a = ["\n  .panel {\n    border: 1px solid black;\n    background-color: green;\n  }\n \n  .title {\n    padding: 4px;\n    font-size: 15px;\n  }\n \n  .select {\n\t\t-webkit-appearance: none;\n\t\t-moz-appearance: none;\n\n\t\tbackground: yellow;\n\n  }\n\n  .selectInvalid: {\n    border-color: red;\n  }\n\n  .selectLocked: {\n  \t\t&.locked {\n\t\t\tbackground: linear-gradient(to bottom, @select-background-gradient-top-color 0%, @select-background-gradient-bottom-color 100%);\n\t\t\tcolor: @text-color;\n\t\t\tborder: none;\n\t\t}\n\n  }\n\n  .selectInvalidLocked: {\n  }\n\n  .option: {\n  }\n\n  .optionInvalid: {\n  }\n"], _a.raw = ["\n  .panel {\n    border: 1px solid black;\n    background-color: green;\n  }\n \n  .title {\n    padding: 4px;\n    font-size: 15px;\n  }\n \n  .select {\n\t\t-webkit-appearance: none;\n\t\t-moz-appearance: none;\n\n\t\tbackground: yellow;\n\n  }\n\n  .selectInvalid: {\n    border-color: red;\n  }\n\n  .selectLocked: {\n  \t\t&.locked {\n\t\t\tbackground: linear-gradient(to bottom, @select-background-gradient-top-color 0%, @select-background-gradient-bottom-color 100%);\n\t\t\tcolor: @text-color;\n\t\t\tborder: none;\n\t\t}\n\n  }\n\n  .selectInvalidLocked: {\n  }\n\n  .option: {\n  }\n\n  .optionInvalid: {\n  }\n"], csjs_1.default(_a));
console.log("styles", styles2);
console.log("styles", styles2.panel.toString());
function ComboboxPropertySelector(_a) {
    var sortValidFirst = _a.sortValidFirst, propertyName = _a.propertyName, propertyValueSet = _a.propertyValueSet, valueItems = _a.valueItems, showCodes = _a.showCodes, onValueChange = _a.onValueChange, filterPrettyPrint = _a.filterPrettyPrint, readOnly = _a.readOnly, locked = _a.locked, styles = _a.styles;
    var value = promaster_primitives_1.PropertyValueSet.getInteger(propertyName, propertyValueSet);
    if (!valueItems)
        valueItems = [];
    var selectedValueItemOrUndefined = valueItems.find(function (item) { return (item.value && promaster_primitives_1.PropertyValue.getInteger(item.value)) === value; });
    var selectedValueItem;
    if (!selectedValueItemOrUndefined) {
        selectedValueItem = {
            value: undefined,
            sortNo: -1,
            text: value === undefined ? "" : value.toString(),
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
        if (sortValidFirst) {
            if (a.isItemValid && !b.isItemValid) {
                return -1;
            }
            if (!a.isItemValid && b.isItemValid) {
                return 1;
            }
        }
        if (a.sortNo < b.sortNo) {
            return -1;
        }
        if (a.sortNo > b.sortNo) {
            return 1;
        }
        return 0;
    });
    var selectedOption = options.find(function (option) { return option.value === _getItemValue(selectedValueItem); });
    if (!selectedOption)
        throw new Error("Could not find..");
    var selectClassName;
    if (!selectedOption.isItemValid && locked) {
        selectClassName = styles.selectInvalidLocked;
    }
    else if (!selectedOption.isItemValid) {
        selectClassName = styles.selectInvalid;
    }
    else if (locked) {
        selectClassName = styles.selectLocked;
    }
    else {
        selectClassName = styles2.select;
    }
    return (React.createElement("select", {className: selectClassName, disabled: readOnly || locked, value: selectedOption.value, title: selectedOption.toolTip, onChange: function (event) { return _doOnChange(event.target.value, onValueChange); }}, options.map(function (option) { return (React.createElement("option", {key: option.value, value: option.value, title: option.toolTip, className: option.isItemValid ? styles.option : styles.optionInvalid}, (option.isItemValid ? '' : '✘ ') + option.label)); })));
}
exports.ComboboxPropertySelector = ComboboxPropertySelector;
function _getItemLabel(valueItem, showCodes) {
    return valueItem.text + (showCodes ? " (" + (valueItem.value !== undefined ? promaster_primitives_1.PropertyValue.toString(valueItem.value) : "undefined") + ")" : '');
}
function _doOnChange(newValue, onValueChange) {
    if (newValue === "undefined") {
        onValueChange(undefined);
    }
    else {
        onValueChange(promaster_primitives_1.PropertyValue.create("integer", parseInt(newValue)));
    }
}
function _getItemValue(valueItem) {
    return valueItem.value === undefined ? "undefined" : promaster_primitives_1.PropertyValue.toString(valueItem.value);
}
function _getItemInvalidMessage(valueItem, filterPrettyPrint) {
    return filterPrettyPrint(valueItem.validationFilter);
}
function _isValueItemValid(propertyName, propertyValueSet, valueItem) {
    if (valueItem.value === undefined)
        return true;
    var pvsToCheck = promaster_primitives_1.PropertyValueSet.set(propertyName, valueItem.value, propertyValueSet);
    if (!valueItem.validationFilter)
        return true;
    return promaster_primitives_1.PropertyFilter.isValid(pvsToCheck, valueItem.validationFilter);
}
var _a;
//# sourceMappingURL=combobox-property-selector.js.map
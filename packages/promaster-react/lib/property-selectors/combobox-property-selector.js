import * as React from "react";
import { PropertyFilter, PropertyValue, PropertyValueSet } from "promaster-primitives";
export function ComboboxPropertySelector({ sortValidFirst, propertyName, propertyValueSet, valueItems, showCodes, onValueChange, filterPrettyPrint, readOnly, locked, classNames }) {
    const value = PropertyValueSet.getInteger(propertyName, propertyValueSet);
    if (!valueItems)
        valueItems = [];
    const selectedValueItemOrUndefined = valueItems.find((item) => (item.value && PropertyValue.getInteger(item.value)) === value);
    let selectedValueItem;
    if (!selectedValueItemOrUndefined) {
        selectedValueItem = {
            value: null,
            sortNo: -1,
            text: value == null ? "" : value.toString(),
            validationFilter: PropertyFilter.Empty
        };
        valueItems = [selectedValueItem].concat(valueItems);
    }
    else {
        selectedValueItem = selectedValueItemOrUndefined;
    }
    const options = valueItems
        .map(valueItem => {
        const isItemValid = _isValueItemValid(propertyName, propertyValueSet, valueItem);
        return {
            value: _getItemValue(valueItem),
            label: _getItemLabel(valueItem, showCodes),
            isItemValid: isItemValid,
            sortNo: valueItem.sortNo,
            toolTip: isItemValid ? "" : _getItemInvalidMessage(valueItem, filterPrettyPrint)
        };
    }).sort((a, b) => {
        if (a.sortNo < b.sortNo) {
            return -1;
        }
        if (a.sortNo > b.sortNo) {
            return 1;
        }
        return 0;
    }).sort((a, b) => {
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
    const selectedOption = options.find((option) => option.value === _getItemValue(selectedValueItem));
    if (!selectedOption)
        throw new Error("Could not find..");
    let selectClassName;
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
    return (React.createElement("select", {className: selectClassName, disabled: readOnly || locked, value: selectedOption.value, title: selectedOption.toolTip, onChange: event => _doOnChange(event.target.value, onValueChange)}, options.map(option => (React.createElement("option", {key: option.value, value: option.value, title: option.toolTip, className: option.isItemValid ? classNames.option : classNames.optionInvalid}, (option.isItemValid ? '' : '✘ ') + option.label)))));
}
function _getItemLabel(valueItem, showCodes) {
    return valueItem.text + (showCodes ? ` (${valueItem.value !== null ? PropertyValue.toString(valueItem.value) : "null"})` : '');
}
function _doOnChange(newValue, onValueChange) {
    if (newValue === "") {
        onValueChange(null);
    }
    else {
        onValueChange(PropertyValue.create("integer", parseInt(newValue)));
    }
}
function _getItemValue(valueItem) {
    return valueItem.value == null ? "" : PropertyValue.toString(valueItem.value);
}
function _getItemInvalidMessage(valueItem, filterPrettyPrint) {
    return filterPrettyPrint(valueItem.validationFilter);
}
function _isValueItemValid(propertyName, propertyValueSet, valueItem) {
    if (valueItem.value === null)
        return true;
    let pvsToCheck = PropertyValueSet.set(propertyName, valueItem.value, propertyValueSet);
    if (!valueItem.validationFilter)
        return true;
    return PropertyFilter.isValid(pvsToCheck, valueItem.validationFilter);
}

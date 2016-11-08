import * as React from "react";
import {PropertyFilter, PropertyValue, PropertyValueSet} from "promaster-primitives";
import {PropertyFiltering} from "promaster-portable";
import {comboboxPropertySelectorStyles, ComboboxPropertySelectorStyles} from "./combobox-property-selector-styles";

export interface ComboBoxPropertyValueItem {
    readonly value: PropertyValue.PropertyValue | undefined,
    readonly sortNo: number,
    readonly text: string,
    readonly validationFilter: PropertyFilter.PropertyFilter
}

export interface ComboboxPropertySelectorProps {
    readonly sortValidFirst: boolean,
    readonly propertyName: string,
    readonly propertyValueSet: PropertyValueSet.PropertyValueSet,
    readonly valueItems: ReadonlyArray<ComboBoxPropertyValueItem>,
    readonly showCodes: boolean,
    readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
    readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void,
    readonly readOnly: boolean,
    readonly locked: boolean,
    readonly styles?: ComboboxPropertySelectorStyles,
}

export function ComboboxPropertySelector({
    sortValidFirst,
    propertyName,
    propertyValueSet,
    valueItems,
    showCodes,
    onValueChange,
    filterPrettyPrint,
    readOnly,
    locked,
    styles = comboboxPropertySelectorStyles
}: ComboboxPropertySelectorProps): React.ReactElement<ComboboxPropertySelectorProps> {

    const value = PropertyValueSet.getInteger(propertyName, propertyValueSet);

    if (!valueItems)
        valueItems = [];
    const selectedValueItemOrUndefined = valueItems.find((item) => (item.value && PropertyValue.getInteger(item.value)) === value);
    let selectedValueItem: ComboBoxPropertyValueItem;
    if (!selectedValueItemOrUndefined) {
        selectedValueItem = {
            value: undefined,
            sortNo: -1,
            text: value === undefined ? "" : value.toString(),
            validationFilter: PropertyFilter.Empty
        };
        // Add value items for selected value, even tough it does not really exist, but we need to show it in the combobox
        // valueItems.unshift(selectedValueItem);
        valueItems = ([selectedValueItem] as ReadonlyArray<ComboBoxPropertyValueItem>).concat(valueItems);
    }
    else {
        selectedValueItem = selectedValueItemOrUndefined;
    }

    interface Option {
      value: string,
      label: string,
      isItemValid: boolean,
      sortNo: number,
      toolTip: string
    }

    // Convert value items to options
    const options: Array<Option> = valueItems
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

    const selectedOption = options.find((option) => option.value === _getItemValue(selectedValueItem));
    if (!selectedOption)
        throw new Error("Could not find..");

    let selectClassName: string;
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
        selectClassName = styles.select;
    }

    return (
        <select className={selectClassName}
                disabled={readOnly || locked}
                value={selectedOption.value}
                title={selectedOption.toolTip}
                onChange={event => _doOnChange((event.target as HTMLSelectElement).value, onValueChange)}>
            {
                options.map(option => (
                    <option key={option.value}
                            value={option.value}
                            title={option.toolTip}
                            className={option.isItemValid ? styles.option : styles.optionInvalid}>
                        {(option.isItemValid ? '' : '✘ ') + option.label}
                    </option>)
                )
            }
        </select>);

}

function _getItemLabel(valueItem: ComboBoxPropertyValueItem, showCodes: boolean) {
    return valueItem.text + (showCodes ? ` (${valueItem.value !== undefined ? PropertyValue.toString(valueItem.value) : "undefined"})` : '');
}

function _doOnChange(newValue: any, onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void) {
    if (newValue === "undefined") {
        onValueChange(undefined);
    }
    else {
        onValueChange(PropertyValue.create("integer", parseInt(newValue)));
    }
}

function _getItemValue(valueItem: ComboBoxPropertyValueItem) {
    return valueItem.value === undefined ? "undefined" : PropertyValue.toString(valueItem.value);
}

function _getItemInvalidMessage(valueItem: ComboBoxPropertyValueItem, filterPrettyPrint: PropertyFiltering.FilterPrettyPrint) {
    return filterPrettyPrint(valueItem.validationFilter);
}

function _isValueItemValid(propertyName: string, propertyValueSet: PropertyValueSet.PropertyValueSet, valueItem: ComboBoxPropertyValueItem): boolean {

    if (valueItem.value === undefined)
        return true;
    let pvsToCheck = PropertyValueSet.set(propertyName, valueItem.value, propertyValueSet);
    if (!valueItem.validationFilter)
        return true;
    return PropertyFilter.isValid(pvsToCheck, valueItem.validationFilter);

}

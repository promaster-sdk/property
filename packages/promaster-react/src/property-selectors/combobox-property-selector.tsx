import * as React from "react";
import {PropertyFilter, PropertyValue, PropertyType, PropertyValueSet} from "promaster-primitives";
import {FilterPrettyPrint} from "promaster-portable/lib/property_filtering";

export interface ComboBoxPropertyValueItem {
    readonly value: PropertyValue,
    readonly sortNo: number,
    readonly text: string,
    readonly validationFilter: PropertyFilter
}

export interface ComboboxPropertySelectorProps {
    readonly sortValidFirst: boolean,
    readonly propertyName: string,
    readonly propertyValueSet: PropertyValueSet,
    readonly valueItems: ReadonlyArray<ComboBoxPropertyValueItem>,
    readonly showCodes: boolean,
    readonly filterPrettyPrint: FilterPrettyPrint,
    readonly onValueChange: (newValue: PropertyValue) => void,
    readonly readOnly: boolean,
    readonly locked: boolean,
    readonly classNames: ComboboxPropertySelectorClassNames,
}

export interface ComboboxPropertySelectorClassNames {
    readonly select: string,
    readonly selectInvalid: string,
    readonly selectLocked: string,
    readonly selectInvalidLocked: string,
    readonly option: string,
    readonly optionInvalid: string,
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
    classNames
}: ComboboxPropertySelectorProps): React.ReactElement<ComboboxPropertySelectorProps> {

    const value = propertyValueSet.getInteger(propertyName, ()=>null);

    if (!valueItems)
        valueItems = [];
    let selectedValueItem = valueItems.find((item) => (item.value && item.value.getInteger()) === value);
    if (!selectedValueItem) {
        selectedValueItem = {
            value: null,
            sortNo: null,
            text: value == null ? "" : value.toString(),
            validationFilter: PropertyFilter.Empty
        };
        // Add value items for selected value, even tough it does not really exist, but we need to show it in the combobox
        // valueItems.unshift(selectedValueItem);
        valueItems = ([selectedValueItem] as ReadonlyArray<ComboBoxPropertyValueItem>).concat(valueItems);
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

    let selectClassName:string; //= "property-selector" + (selectedOption.isItemValid ? "" : " invalid") + (locked ? " locked" : '');
    if(!selectedOption.isItemValid && locked) {
        selectClassName = classNames.selectInvalidLocked;
    }
    else if(!selectedOption.isItemValid) {
        selectClassName = classNames.selectInvalid;
    }
    else if(locked) {
        selectClassName = classNames.selectLocked;
    }
    else {
        selectClassName = classNames.select;
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
                                className={option.isItemValid ? classNames.option : classNames.optionInvalid}>
                            {(option.isItemValid ? '' : '✘ ') + option.label}
                        </option>)
                    )
                }
        </select>);

}

function _getItemLabel(valueItem: ComboBoxPropertyValueItem, showCodes: boolean) {
    return valueItem.text + (showCodes ? ` (${valueItem.value !== null ? valueItem.value : "null"})` : '');
}

function _doOnChange(newValue: any, onValueChange: (newValue: PropertyValue)=>void) {
    if (newValue === "") {
        onValueChange(null);
    }
    else {
        onValueChange(new PropertyValue(PropertyType.Integer, parseInt(newValue)));
    }
}

function _getItemValue(valueItem: ComboBoxPropertyValueItem) {
    return valueItem.value == null ? "" : valueItem.value.toString();
}

function _getItemInvalidMessage(valueItem: ComboBoxPropertyValueItem, filterPrettyPrint: FilterPrettyPrint) {
    return filterPrettyPrint(valueItem.validationFilter);
}

function _isValueItemValid(propertyName: string, propertyValueSet: PropertyValueSet, valueItem: ComboBoxPropertyValueItem): boolean {

    if (valueItem.value === null)
        return true;
    let pvsToCheck = propertyValueSet.set(propertyName, valueItem.value);
    if (!valueItem.validationFilter)
        return true;
    return valueItem.validationFilter.isValid(pvsToCheck);

}
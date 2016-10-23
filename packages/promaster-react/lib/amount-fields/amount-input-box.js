import * as React from "react";
import { Amount } from "promaster-primitives";
export class AmountInputBox extends React.Component {
    constructor() {
        super();
        this._debouncedOnValueChange = debounce(this._debouncedOnValueChange, 350);
    }
    componentWillMount() {
        this.initStateFromProps(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.initStateFromProps(nextProps);
    }
    initStateFromProps(initProps) {
        const { value, inputUnit, inputDecimalCount } = initProps;
        if (!inputUnit)
            console.error("Missing inputUnit");
        if (!(inputDecimalCount !== null && inputDecimalCount !== undefined))
            console.error("Missing inputDecimalCount");
        const formattedValue = _formatWithUnitAndDecimalCount(value, inputUnit, inputDecimalCount);
        this.updateState(value, formattedValue);
    }
    render() {
        const { onValueChange, readOnly, classNames } = this.props;
        const { effectiveErrorMessage, textValue } = this.state;
        return (React.createElement("input", {key: "input", type: "text", value: textValue, readOnly: readOnly, onChange: (e) => this._onChange(e, onValueChange), title: effectiveErrorMessage, className: effectiveErrorMessage ? classNames.inputInvalid : classNames.input}));
    }
    _debouncedOnValueChange(newAmount, onValueChange) {
        if (this.state.isValid)
            onValueChange(newAmount);
    }
    _onChange(e, onValueChange) {
        const newStringValue = e.target.value.replace(",", ".");
        const { inputUnit, inputDecimalCount } = this.props;
        const stringDecimalCount = _getDecimalCountFromString(newStringValue);
        if (stringDecimalCount > inputDecimalCount)
            return;
        const newAmount = _unformatWithUnitAndDecimalCount(newStringValue, inputUnit, inputDecimalCount);
        const isValid = this.updateState(newAmount, newStringValue);
        if (isValid && newAmount)
            this._debouncedOnValueChange(newAmount, onValueChange);
    }
    updateState(newAmount, newStringValue) {
        const { isRequiredMessage, notNumericMessage, errorMessage } = this.props;
        const internalErrorMessage = getInternalErrorMessage(newAmount, newStringValue, isRequiredMessage, notNumericMessage);
        if (internalErrorMessage) {
            this.setState({ isValid: false, textValue: newStringValue, effectiveErrorMessage: internalErrorMessage });
            return false;
        }
        else {
            this.setState({ isValid: true, textValue: newStringValue, effectiveErrorMessage: errorMessage });
            return true;
        }
    }
}
function getInternalErrorMessage(newAmount, newStringValue, isRequiredMessage, notNumericMessage) {
    if (newStringValue.trim() === "" && isRequiredMessage) {
        return isRequiredMessage;
    }
    if (newStringValue.trim() !== "" && !newAmount) {
        return notNumericMessage;
    }
    return null;
}
function _formatWithUnitAndDecimalCount(amount, unit, decimalCount) {
    if (!amount)
        return "";
    let valueToUse;
    if (amount.unit === unit) {
        valueToUse = amount.value;
        if (amount.decimalCount <= decimalCount)
            return valueToUse.toFixed(amount.decimalCount);
        else
            return valueToUse.toFixed(decimalCount);
    }
    else {
        valueToUse = Amount.valueAs(unit, amount);
        return valueToUse.toFixed(decimalCount);
    }
}
function _unformatWithUnitAndDecimalCount(text, unit, inputDecimalCount) {
    if (!text || text.length === 0)
        return null;
    const parsedFloatValue = _filterFloat(text);
    if (isNaN(parsedFloatValue))
        return null;
    const textDecimalCount = _getDecimalCountFromString(text);
    const finalDecimalCount = textDecimalCount > inputDecimalCount ? inputDecimalCount : textDecimalCount;
    const finalFloatValue = textDecimalCount > inputDecimalCount ? parseFloat(parsedFloatValue.toFixed(inputDecimalCount)) : parsedFloatValue;
    return Amount.create(finalFloatValue, unit, finalDecimalCount);
}
function _getDecimalCountFromString(stringValue) {
    const pointIndex = stringValue.indexOf('.');
    if (pointIndex >= 0)
        return stringValue.length - pointIndex - 1;
    return 0;
}
function _filterFloat(value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
        .test(value))
        return Number(value);
    return NaN;
}
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}

"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var promaster_primitives_1 = require("promaster-primitives");
var AmountInputBox = (function (_super) {
    __extends(AmountInputBox, _super);
    function AmountInputBox() {
        _super.call(this);
        this._debouncedOnValueChange = debounce(this._debouncedOnValueChange, 350);
    }
    AmountInputBox.prototype.componentWillMount = function () {
        this.initStateFromProps(this.props);
    };
    AmountInputBox.prototype.componentWillReceiveProps = function (nextProps) {
        this.initStateFromProps(nextProps);
    };
    AmountInputBox.prototype.initStateFromProps = function (initProps) {
        var value = initProps.value, inputUnit = initProps.inputUnit, inputDecimalCount = initProps.inputDecimalCount;
        if (!inputUnit)
            console.error("Missing inputUnit");
        if (!(inputDecimalCount !== null && inputDecimalCount !== undefined))
            console.error("Missing inputDecimalCount");
        var formattedValue = _formatWithUnitAndDecimalCount(value, inputUnit, inputDecimalCount);
        this.updateState(value, formattedValue);
    };
    AmountInputBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, onValueChange = _a.onValueChange, readOnly = _a.readOnly, classNames = _a.classNames;
        var _b = this.state, effectiveErrorMessage = _b.effectiveErrorMessage, textValue = _b.textValue;
        return (React.createElement("input", {key: "input", type: "text", value: textValue, readOnly: readOnly, onChange: function (e) { return _this._onChange(e, onValueChange); }, title: effectiveErrorMessage, className: effectiveErrorMessage ? classNames.inputInvalid : classNames.input}));
    };
    AmountInputBox.prototype._debouncedOnValueChange = function (newAmount, onValueChange) {
        if (this.state.isValid)
            onValueChange(newAmount);
    };
    AmountInputBox.prototype._onChange = function (e, onValueChange) {
        var newStringValue = e.target.value.replace(",", ".");
        var _a = this.props, inputUnit = _a.inputUnit, inputDecimalCount = _a.inputDecimalCount;
        var stringDecimalCount = _getDecimalCountFromString(newStringValue);
        if (stringDecimalCount > inputDecimalCount)
            return;
        var newAmount = _unformatWithUnitAndDecimalCount(newStringValue, inputUnit, inputDecimalCount);
        var isValid = this.updateState(newAmount, newStringValue);
        if (isValid && newAmount)
            this._debouncedOnValueChange(newAmount, onValueChange);
    };
    AmountInputBox.prototype.updateState = function (newAmount, newStringValue) {
        var _a = this.props, isRequiredMessage = _a.isRequiredMessage, notNumericMessage = _a.notNumericMessage, errorMessage = _a.errorMessage;
        var internalErrorMessage = getInternalErrorMessage(newAmount, newStringValue, isRequiredMessage, notNumericMessage);
        if (internalErrorMessage) {
            this.setState({ isValid: false, textValue: newStringValue, effectiveErrorMessage: internalErrorMessage });
            return false;
        }
        else {
            this.setState({ isValid: true, textValue: newStringValue, effectiveErrorMessage: errorMessage });
            return true;
        }
    };
    return AmountInputBox;
}(React.Component));
exports.AmountInputBox = AmountInputBox;
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
    var valueToUse;
    if (amount.unit === unit) {
        valueToUse = amount.value;
        if (amount.decimalCount <= decimalCount)
            return valueToUse.toFixed(amount.decimalCount);
        else
            return valueToUse.toFixed(decimalCount);
    }
    else {
        valueToUse = promaster_primitives_1.Amount.valueAs(unit, amount);
        return valueToUse.toFixed(decimalCount);
    }
}
function _unformatWithUnitAndDecimalCount(text, unit, inputDecimalCount) {
    if (!text || text.length === 0)
        return null;
    var parsedFloatValue = _filterFloat(text);
    if (isNaN(parsedFloatValue))
        return null;
    var textDecimalCount = _getDecimalCountFromString(text);
    var finalDecimalCount = textDecimalCount > inputDecimalCount ? inputDecimalCount : textDecimalCount;
    var finalFloatValue = textDecimalCount > inputDecimalCount ? parseFloat(parsedFloatValue.toFixed(inputDecimalCount)) : parsedFloatValue;
    return promaster_primitives_1.Amount.create(finalFloatValue, unit, finalDecimalCount);
}
function _getDecimalCountFromString(stringValue) {
    var pointIndex = stringValue.indexOf('.');
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
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
//# sourceMappingURL=amount-input-box.js.map
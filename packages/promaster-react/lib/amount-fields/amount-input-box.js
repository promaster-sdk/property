"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var promaster_primitives_1 = require("@promaster/promaster-primitives");
var amount_input_box_styles_1 = require("./amount-input-box-styles");
var AmountInputBox = (function (_super) {
    __extends(AmountInputBox, _super);
    function AmountInputBox() {
        var _this = _super.call(this) || this;
        _this._debouncedOnValueChange = debounce(_this._debouncedOnValueChange, 350);
        return _this;
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
        var formattedValue = formatWithUnitAndDecimalCount(value, inputUnit, inputDecimalCount);
        var newState = calculateNewState(value, formattedValue, initProps.isRequiredMessage, initProps.notNumericMessage, initProps.errorMessage);
        this.setState(newState);
    };
    AmountInputBox.prototype.render = function () {
        var _this = this;
        var _a = this.props, onValueChange = _a.onValueChange, readOnly = _a.readOnly, _b = _a.styles, styles = _b === void 0 ? amount_input_box_styles_1.amountInputBoxStyles : _b;
        var _c = this.state, effectiveErrorMessage = _c.effectiveErrorMessage, textValue = _c.textValue;
        return (React.createElement("input", { key: "input", type: "text", value: textValue, readOnly: readOnly, onChange: function (e) { return _this._onChange(e, onValueChange); }, title: effectiveErrorMessage, className: effectiveErrorMessage ? styles.inputInvalid : styles.input }));
    };
    AmountInputBox.prototype._debouncedOnValueChange = function (newAmount, onValueChange) {
        if (this.state.isValid)
            onValueChange(newAmount);
    };
    AmountInputBox.prototype._onChange = function (e, onValueChange) {
        var newStringValue = e.target.value.replace(",", ".");
        var _a = this.props, inputUnit = _a.inputUnit, inputDecimalCount = _a.inputDecimalCount;
        var stringDecimalCount = getDecimalCountFromString(newStringValue);
        if (stringDecimalCount > inputDecimalCount)
            return;
        var newAmount = unformatWithUnitAndDecimalCount(newStringValue, inputUnit, inputDecimalCount);
        var newState = calculateNewState(newAmount, newStringValue, this.props.isRequiredMessage, this.props.notNumericMessage, this.props.errorMessage);
        this.setState(newState);
        if (newState.isValid && newAmount)
            this._debouncedOnValueChange(newAmount, onValueChange);
    };
    return AmountInputBox;
}(React.Component));
exports.AmountInputBox = AmountInputBox;
function calculateNewState(newAmount, newStringValue, isRequiredMessage, notNumericMessage, errorMessage) {
    var internalErrorMessage = getInternalErrorMessage(newAmount, newStringValue, isRequiredMessage, notNumericMessage);
    if (internalErrorMessage) {
        return { isValid: false, textValue: newStringValue, effectiveErrorMessage: internalErrorMessage };
    }
    else {
        return { isValid: true, textValue: newStringValue, effectiveErrorMessage: errorMessage };
    }
}
function getInternalErrorMessage(newAmount, newStringValue, isRequiredMessage, notNumericMessage) {
    if (newStringValue.trim() === "" && isRequiredMessage) {
        return isRequiredMessage;
    }
    if (newStringValue.trim() !== "" && !newAmount) {
        return notNumericMessage;
    }
    return undefined;
}
function formatWithUnitAndDecimalCount(amount, unit, decimalCount) {
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
function unformatWithUnitAndDecimalCount(text, unit, inputDecimalCount) {
    if (!text || text.length === 0)
        return undefined;
    var parsedFloatValue = filterFloat(text);
    if (isNaN(parsedFloatValue))
        return undefined;
    var textDecimalCount = getDecimalCountFromString(text);
    var finalDecimalCount = textDecimalCount > inputDecimalCount ? inputDecimalCount : textDecimalCount;
    var finalFloatValue = textDecimalCount > inputDecimalCount ? parseFloat(parsedFloatValue.toFixed(inputDecimalCount)) : parsedFloatValue;
    return promaster_primitives_1.Amount.create(finalFloatValue, unit, finalDecimalCount);
}
function getDecimalCountFromString(stringValue) {
    var pointIndex = stringValue.indexOf('.');
    if (pointIndex >= 0)
        return stringValue.length - pointIndex - 1;
    return 0;
}
function filterFloat(value) {
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
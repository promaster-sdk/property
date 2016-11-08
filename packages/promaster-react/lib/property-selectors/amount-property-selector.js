"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var promaster_primitives_1 = require("promaster-primitives");
var index_1 = require("../amount-fields/index");
var AmountPropertySelector = (function (_super) {
    __extends(AmountPropertySelector, _super);
    function AmountPropertySelector() {
        _super.apply(this, arguments);
    }
    AmountPropertySelector.prototype.render = function () {
        var _a = this.props, onValueChange = _a.onValueChange, onFormatChanged = _a.onFormatChanged, notNumericMessage = _a.notNumericMessage, isRequiredMessage = _a.isRequiredMessage, validationFilter = _a.validationFilter, propertyValueSet = _a.propertyValueSet, propertyName = _a.propertyName, filterPrettyPrint = _a.filterPrettyPrint, inputUnit = _a.inputUnit, inputDecimalCount = _a.inputDecimalCount, readOnly = _a.readOnly, classNames = _a.classNames;
        var value = promaster_primitives_1.PropertyValueSet.getAmount(propertyName, propertyValueSet);
        if (!value)
            throw new Error("Value is undefined");
        return (React.createElement("span", {className: classNames.amount}, 
            React.createElement(index_1.AmountInputBox, {value: value, inputUnit: inputUnit, inputDecimalCount: inputDecimalCount, notNumericMessage: notNumericMessage, isRequiredMessage: isRequiredMessage, errorMessage: _getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint), readOnly: readOnly, onValueChange: function (newAmount) {
                return onValueChange(newAmount !== undefined ? promaster_primitives_1.PropertyValue.create("amount", newAmount) : undefined);
            }, classNames: classNames.amountInputBoxClassNames}), 
            React.createElement(index_1.AmountFormatSelector, {selectedUnit: inputUnit, selectedDecimalCount: inputDecimalCount, onFormatChanged: onFormatChanged, styles: classNames.amountFormatSelectorClassNames})));
    };
    return AmountPropertySelector;
}(React.Component));
exports.AmountPropertySelector = AmountPropertySelector;
function _getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint) {
    if (!value || !validationFilter) {
        return '';
    }
    if (promaster_primitives_1.PropertyFilter.isValid(propertyValueSet, validationFilter)) {
        return '';
    }
    else {
        return filterPrettyPrint(validationFilter);
    }
}
//# sourceMappingURL=amount-property-selector.js.map
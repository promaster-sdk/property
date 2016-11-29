"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var promaster_primitives_1 = require("@promaster/promaster-primitives");
var textbox_property_selector_styles_1 = require("./textbox-property-selector-styles");
var TextboxPropertySelector = (function (_super) {
    __extends(TextboxPropertySelector, _super);
    function TextboxPropertySelector() {
        _super.call(this);
        this._debouncedOnValueChange = debounce(this._debouncedOnValueChange, 350);
    }
    TextboxPropertySelector.prototype.componentWillMount = function () {
        var value = this.props.value;
        this.setState({ textValue: value });
    };
    TextboxPropertySelector.prototype.componentWillReceiveProps = function (nextProps) {
        var value = nextProps.value;
        this.setState({ textValue: value });
    };
    TextboxPropertySelector.prototype.render = function () {
        var _this = this;
        var _a = this.props, onValueChange = _a.onValueChange, readOnly = _a.readOnly, _b = _a.styles, styles = _b === void 0 ? textbox_property_selector_styles_1.textboxPropertySelectorStyles : _b;
        var textValue = this.state.textValue;
        return (React.createElement("input", {type: 'text', value: textValue, className: styles.textbox, readOnly: readOnly, onChange: function (e) { return _this._onChange(e, onValueChange); }}));
    };
    TextboxPropertySelector.prototype._debouncedOnValueChange = function (newValue, onValueChange) {
        onValueChange(newValue);
    };
    TextboxPropertySelector.prototype._onChange = function (e, onValueChange) {
        var newStringValue = e.target.value;
        this.setState({ textValue: newStringValue });
        this._debouncedOnValueChange(promaster_primitives_1.PropertyValue.create("text", newStringValue), onValueChange);
    };
    return TextboxPropertySelector;
}(React.Component));
exports.TextboxPropertySelector = TextboxPropertySelector;
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
//# sourceMappingURL=textbox-property-selector.js.map
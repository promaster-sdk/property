"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var csjs_1 = require("csjs");
var insert_css_1 = require("insert-css");
var defaultStyles = (_a = ["\n  .dropdown {\n    user-select: none;\n  }\n\n  .dropdown img {\n    vertical-align: middle;\n  }\n  \n  .dropdownButton {\n    display: flex;\n    align-items: center;\n    background: white;\n    color: black;\n    height: 30px;\n    white-space: nowrap;\n    border: 1px solid #b4b4b4;\n    border-radius: 3px;\n    font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;\n    outline: rgb(131, 131, 131) none 0px;\n    padding: 1px 5px 0px 14px;\n  }\n  \n  .dropdownButton i {\n    margin-left: 10px;\n  }\n  \n  .dropdownButton img {\n    max-width: 1em;\n    max-height: 1em;\n  }\n  \n  .dropdownBackground {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n  }\n  \n  .dropdownOptions {\n    position: absolute;\n    display: block;\n    background: white;\n    border: 1px solid #bbb;    \n    list-style: none;\n    margin: 0;\n    padding: 0;\n  }\n  \n  .dropdownOption {\n    padding: 0.2em 0.5em;\n    cursor: default;\n  }\n\n  .dropdownOption img {\n    max-width: 2em;\n    max-height: 2em;\n  }\n  \n  .dropdownOptions .dropdownOption:hover {\n    background-color: blue;\n    color: white;\n  }\n"], _a.raw = ["\n  .dropdown {\n    user-select: none;\n  }\n\n  .dropdown img {\n    vertical-align: middle;\n  }\n  \n  .dropdownButton {\n    display: flex;\n    align-items: center;\n    background: white;\n    color: black;\n    height: 30px;\n    white-space: nowrap;\n    border: 1px solid #b4b4b4;\n    border-radius: 3px;\n    font: normal normal 300 normal 15px / 30px Helvetica, Arial, sans-serif;\n    outline: rgb(131, 131, 131) none 0px;\n    padding: 1px 5px 0px 14px;\n  }\n  \n  .dropdownButton i {\n    margin-left: 10px;\n  }\n  \n  .dropdownButton img {\n    max-width: 1em;\n    max-height: 1em;\n  }\n  \n  .dropdownBackground {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n  }\n  \n  .dropdownOptions {\n    position: absolute;\n    display: block;\n    background: white;\n    border: 1px solid #bbb;    \n    list-style: none;\n    margin: 0;\n    padding: 0;\n  }\n  \n  .dropdownOption {\n    padding: 0.2em 0.5em;\n    cursor: default;\n  }\n\n  .dropdownOption img {\n    max-width: 2em;\n    max-height: 2em;\n  }\n  \n  .dropdownOptions .dropdownOption:hover {\n    background-color: blue;\n    color: white;\n  }\n"], csjs_1.csjs(_a));
insert_css_1.insertCss(csjs_1.csjs.getCss(defaultStyles));
var Dropdown = (function (_super) {
    __extends(Dropdown, _super);
    function Dropdown(props) {
        _super.call(this, props);
        this.state = {
            isOpen: false,
        };
    }
    Dropdown.prototype.render = function () {
        var _this = this;
        var _a = this.props, value = _a.value, onChange = _a.onChange, options = _a.options, _b = _a.styles, styles = _b === void 0 ? defaultStyles : _b, className = _a.className;
        var selected = options.find(function (o) { return o.value === value; });
        var background = this.state.isOpen ? (React.createElement("div", {className: styles.dropdownBackground, onClick: function () { return _this.setState({ isOpen: false }); }})) : undefined;
        var optionsList = this.state.isOpen ? (React.createElement("div", {className: styles.dropdownOptions}, options.map(function (o) {
            var optionClassNames = o.className ? [styles.dropdownOption, o.className] : [styles.dropdownOption];
            return (React.createElement("div", {key: o.value, className: optionClassNames.join(' '), title: o.tooltip, onClick: function () {
                onChange(o.value);
                _this.setState({ isOpen: false });
            }}, _this._renderItem(o)));
        }))) : undefined;
        var classNames = className ? [styles.dropdownButton, className] : [styles.dropdownButton];
        return (React.createElement("div", {className: styles.dropdown}, 
            background, 
            React.createElement("button", {className: classNames.join(' '), title: selected !== undefined ? selected.tooltip : undefined, onClick: function () { return _this.setState({ isOpen: !_this.state.isOpen }); }}, 
                this._renderItem(selected), 
                React.createElement("i", {className: "fa fa-caret-down"})), 
            optionsList));
    };
    Dropdown.prototype._renderItem = function (item) {
        if (item === undefined) {
            return (React.createElement("span", null));
        }
        var image = item.imageUrl ? (React.createElement("img", {src: item.imageUrl})) : (React.createElement("span", null));
        return (React.createElement("span", null, 
            image, 
            " " + item.label + " "));
    };
    return Dropdown;
}(React.Component));
exports.Dropdown = Dropdown;
var _a;
//# sourceMappingURL=index.js.map
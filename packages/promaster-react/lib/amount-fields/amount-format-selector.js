"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var promaster_primitives_1 = require("promaster-primitives");
var AmountFormatSelector = (function (_super) {
    __extends(AmountFormatSelector, _super);
    function AmountFormatSelector(props) {
        _super.call(this, props);
        this.state = { active: false };
    }
    AmountFormatSelector.prototype.render = function () {
        var _this = this;
        var _a = this.props, selectedUnit = _a.selectedUnit, selectedDecimalCount = _a.selectedDecimalCount, onFormatChanged = _a.onFormatChanged, styles = _a.styles;
        var className = styles.format;
        if (!this.state.active || !onFormatChanged) {
            return (React.createElement("span", {className: className, onClick: function (_) { return _this.setState({ active: true }); }}, promaster_primitives_1.UnitName.getName(selectedUnit)));
        }
        var units = promaster_primitives_1.Units.getUnitsForQuantity(selectedUnit.quantity);
        var unitNames = units.map(function (u) { return promaster_primitives_1.Units.getStringFromUnit(u); });
        var selectedUnitName = promaster_primitives_1.Units.getStringFromUnit(selectedUnit);
        var decimalCounts = [0, 1, 2, 3, 4, 5];
        if (decimalCounts.indexOf(selectedDecimalCount) === -1)
            decimalCounts.push(selectedDecimalCount);
        var classNameToUse = this.state.active ? styles.formatActive : styles.format;
        return (React.createElement("span", {className: classNameToUse}, 
            React.createElement("select", {className: styles.unit, value: selectedUnitName, onChange: function (e) {
                _this.setState({ active: false });
                _onUnitChange(e, units, selectedDecimalCount, onFormatChanged);
            }}, units.map(function (u, index) { return React.createElement("option", {key: unitNames[index], value: unitNames[index]}, 
                " ", 
                promaster_primitives_1.UnitName.getName(u), 
                " "); })), 
            React.createElement("select", {className: styles.precision, value: selectedDecimalCount.toString(), onChange: function (e) {
                _this.setState({ active: false });
                _onDecimalCountChange(e, selectedUnit, onFormatChanged);
            }}, decimalCounts.map(function (dc) { return React.createElement("option", {key: dc.toString(), value: dc.toString()}, dc); })), 
            React.createElement("button", {className: styles.cancel, onClick: function (_) { return _this.setState({ active: false }); }}, "\u00A0")));
    };
    return AmountFormatSelector;
}(React.Component));
exports.AmountFormatSelector = AmountFormatSelector;
function _onDecimalCountChange(e, selectedUnit, onFormatChanged) {
    var selectedIndex = e.target.selectedIndex;
    var selectedDecimalCount = selectedIndex;
    onFormatChanged(selectedUnit, selectedDecimalCount);
}
function _onUnitChange(e, units, selectedDecimalCount, onFormatChanged) {
    var selectedIndex = e.target.selectedIndex;
    var selectedUnit = units[selectedIndex];
    onFormatChanged(selectedUnit, selectedDecimalCount);
}
//# sourceMappingURL=amount-format-selector.js.map
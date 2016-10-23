import * as React from "react";
import { Units, Unit } from "promaster-primitives";
export class AmountFormatSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
    }
    render() {
        const { selectedUnit, selectedDecimalCount, onFormatChanged, classNames } = this.props;
        const className = classNames.format;
        if (!this.state.active || !onFormatChanged) {
            return (React.createElement("span", {className: className, onClick: (_) => this.setState({ active: true })}, Unit.getLabel(selectedUnit)));
        }
        const quantity = Unit.getQuantityType(selectedUnit);
        const units = Units.getUnitsForQuantity(quantity);
        const unitNames = units.map((u) => Units.getStringFromUnit(u));
        const selectedUnitName = Units.getStringFromUnit(selectedUnit);
        const decimalCounts = [0, 1, 2, 3, 4, 5];
        if (decimalCounts.indexOf(selectedDecimalCount) === -1)
            decimalCounts.push(selectedDecimalCount);
        const classNameToUse = this.state.active ? classNames.formatActive : classNames.format;
        return (React.createElement("span", {className: classNameToUse}, 
            React.createElement("select", {className: classNames.unit, value: selectedUnitName, onChange: (e) => {
                this.setState({ active: false });
                _onUnitChange(e, units, selectedDecimalCount, onFormatChanged);
            }}, units.map((u, index) => React.createElement("option", {key: unitNames[index], value: unitNames[index]}, 
                " ", 
                Unit.getLabel(u), 
                " "))), 
            React.createElement("select", {className: classNames.precision, value: selectedDecimalCount.toString(), onChange: (e) => {
                this.setState({ active: false });
                _onDecimalCountChange(e, selectedUnit, onFormatChanged);
            }}, decimalCounts.map((dc) => React.createElement("option", {key: dc.toString(), value: dc.toString()}, dc))), 
            React.createElement("button", {className: classNames.cancel, onClick: (_) => this.setState({ active: false })}, "\u00A0")));
    }
}
function _onDecimalCountChange(e, selectedUnit, onFormatChanged) {
    const selectedIndex = e.target.selectedIndex;
    const selectedDecimalCount = selectedIndex;
    onFormatChanged(selectedUnit, selectedDecimalCount);
}
function _onUnitChange(e, units, selectedDecimalCount, onFormatChanged) {
    const selectedIndex = e.target.selectedIndex;
    const selectedUnit = units[selectedIndex];
    onFormatChanged(selectedUnit, selectedDecimalCount);
}

/*
 UI to select a unit and a number of decimals independently of each other
 */
import * as React from "react";
import {Units, Unit, UnitName} from "@promaster/promaster-primitives";
import {amountFormatSelectorStyles, AmountFormatSelectorStyles} from "./amount-format-selector-styles";

export interface AmountFormatSelectorProps {
  readonly key?: string,
  readonly selectedUnit: Unit.Unit<any>,
  readonly selectedDecimalCount: number,
  readonly onFormatChanged?: OnFormatChanged,
  readonly onFormatCleared?: OnFormatCleared,
  readonly styles?: AmountFormatSelectorStyles,
}

export interface State {
  readonly active: boolean
}

export type OnFormatChanged = (unit: Unit.Unit<any>, decimalCount: number) => void;
export type OnFormatCleared = () => void;

export class AmountFormatSelector extends React.Component<AmountFormatSelectorProps, State> {

  constructor(props: AmountFormatSelectorProps) {
    super(props);
    this.state = {active: false};
  }

  render() {

    const {
      selectedUnit, selectedDecimalCount, onFormatChanged,
      onFormatCleared, styles = amountFormatSelectorStyles
    } = this.props;

    const className = styles.format;

    // If there is no handler for onFormatChanged then the user should not be able to change the format
    if (!this.state.active || !onFormatChanged) {

      return (
        <span className={className} onClick={(_:any) => this.setState({active: true})}>
                    {UnitName.getName(selectedUnit)}
			    </span>
      );

    }

    // Get a list of all units within the quantity
    const units = Units.getUnitsForQuantity(selectedUnit.quantity);
    const unitNames = units.map((u) => Units.getStringFromUnit(u));
    const selectedUnitName = Units.getStringFromUnit(selectedUnit);

    const decimalCounts = [0, 1, 2, 3, 4, 5];
    if (decimalCounts.indexOf(selectedDecimalCount) === -1)
      decimalCounts.push(selectedDecimalCount);

    const classNameToUse = this.state.active ? styles.formatActive : styles.format;

    return (
      <span className={classNameToUse}>
        <select className={styles.unit} value={selectedUnitName}
                onChange={(e) => {
                  this.setState({active: false});
                  _onUnitChange(e, units, selectedDecimalCount, onFormatChanged);
                  }}>
          {units.map((u, index) => <option key={unitNames[index]} value={unitNames[index]}> {UnitName.getName(u)} </option>)}
        </select>
        <select className={styles.precision}
                value={selectedDecimalCount.toString()}
                onChange={(e) => {
                  this.setState({active: false});
                  _onDecimalCountChange(e, selectedUnit, onFormatChanged);
                }}>{decimalCounts.map((dc) => <option key={dc.toString()} value={dc.toString()}>{dc}</option>)}
        </select>
        {onFormatCleared ?
          <button className={styles.clear} onClick={() => {
            this.setState({active: false});
            onFormatCleared();
          }}>
            {"\u00A0"}
          </button> : <button className={styles.cancel} onClick={() => this.setState({active: false})}>
          {"\u00A0"}
        </button>
        }
      </span>
    );

  }
}

function _onDecimalCountChange(e: React.SyntheticEvent<any>, selectedUnit: Unit.Unit<any>, onFormatChanged: OnFormatChanged) {
  const selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
  const selectedDecimalCount = selectedIndex;
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

function _onUnitChange(e: React.SyntheticEvent<any>, units: Unit.Unit<any>[], selectedDecimalCount: number, onFormatChanged: OnFormatChanged) {
  const selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
  const selectedUnit = units[selectedIndex];
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

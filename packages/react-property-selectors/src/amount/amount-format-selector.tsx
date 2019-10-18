/* eslint-disable functional/no-this-expression */
/*
 UI to select a unit and a number of decimals independently of each other
 */
import * as React from "react";
import { Unit, Serialize, Quantity, Format, UnitFormat } from "uom";
import {
  AmountFormatWrapper,
  AmountFormatWrapperProps
} from "./amount-format-wrapper";

export interface AmountFormatSelectorProps {
  readonly key?: string;
  readonly selectedUnit: Unit.Unit<Quantity.Quantity>;
  readonly selectedDecimalCount: number;
  readonly onFormatChanged?: OnFormatChanged;
  readonly onFormatCleared?: OnFormatCleared;
  readonly onFormatSelectorActiveChanged?: OnFormatSelectorToggled;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
}

export interface State {
  readonly active: boolean;
}

export type OnFormatChanged = (
  unit: Unit.Unit<Quantity.Quantity>,
  decimalCount: number
) => void;
export type OnFormatCleared = () => void;
export type OnFormatSelectorToggled = (active: boolean) => void;

export type AmountFormatSelector = React.ComponentClass<
  AmountFormatSelectorProps
>;
export interface CreateAmountFormatSelectorParams {
  readonly ClearButton?: React.ComponentType<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >;
  readonly CancelButton?: React.ComponentType<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >;
  readonly PrecisionSelector?: React.ComponentType<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >
  >;
  readonly UnitSelector?: React.ComponentType<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >
  >;
  readonly AmountFormatWrapper?: React.ComponentType<AmountFormatWrapperProps>;
}

const defaultClearButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
): JSX.Element => <button {...props} />;
const defaultCancelButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
): JSX.Element => <button {...props} />;
const defaultPrecisionSelector = (
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
): JSX.Element => <select {...props} />;
const defaultUnitSelector = (
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
): JSX.Element => <select {...props} />;
const defaultFormatWrapper = AmountFormatWrapper;

export function createAmountFormatSelector({
  ClearButton = defaultClearButton,
  CancelButton = defaultCancelButton,
  PrecisionSelector = defaultPrecisionSelector,
  UnitSelector = defaultUnitSelector,
  AmountFormatWrapper = defaultFormatWrapper
}: CreateAmountFormatSelectorParams): AmountFormatSelector {
  // eslint-disable-next-line functional/no-class
  return class AmountFormatSelector extends React.Component<
    AmountFormatSelectorProps,
    State
  > {
    constructor(props: AmountFormatSelectorProps) {
      super(props);
      this.state = { active: false };
    }

    componentDidUpdate(_: AmountFormatSelectorProps, prevState: State): void {
      if (
        this.props.onFormatSelectorActiveChanged &&
        prevState.active !== this.state.active
      ) {
        this.props.onFormatSelectorActiveChanged(this.state.active);
      }
    }

    render(): React.ReactElement<AmountFormatSelectorProps> {
      const {
        selectedUnit,
        selectedDecimalCount,
        onFormatChanged,
        onFormatCleared,
        unitsFormat
      } = this.props;

      // If there is no handler for onFormatChanged then the user should not be able to change the format
      if (!this.state.active || !onFormatChanged) {
        const format = Format.getUnitFormat(selectedUnit, unitsFormat);

        return (
          <AmountFormatWrapper
            active={this.state.active}
            onClick={() => this.setState({ active: true })}
          >
            {format ? format.label : ""}
          </AmountFormatWrapper>
        );
      }

      // Get a list of all units within the quantity
      const units = Format.getUnitsForQuantity(
        selectedUnit.quantity,
        unitsFormat
      );
      const unitNames = units.map(u => Serialize.unitToString(u));
      const selectedUnitName = Serialize.unitToString(selectedUnit);

      const decimalCounts = [0, 1, 2, 3, 4, 5];
      if (decimalCounts.indexOf(selectedDecimalCount) === -1) {
        decimalCounts.push(selectedDecimalCount);
      }

      return (
        <AmountFormatWrapper active={this.state.active}>
          <UnitSelector
            value={selectedUnitName}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => {
              this.setState({ active: false });
              _onUnitChange(e, units, selectedDecimalCount, onFormatChanged);
            }}
          >
            {units.map((u, index) => {
              const format = Format.getUnitFormat(u, unitsFormat);
              return (
                <option key={unitNames[index]} value={unitNames[index]}>
                  {" "}
                  {format ? format.label : ""}{" "}
                </option>
              );
            })}
          </UnitSelector>
          <PrecisionSelector
            value={selectedDecimalCount.toString()}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => {
              this.setState({ active: false });
              _onDecimalCountChange(e, selectedUnit, onFormatChanged);
            }}
          >
            {decimalCounts.map(dc => (
              <option key={dc.toString()} value={dc.toString()}>
                {dc}
              </option>
            ))}
          </PrecisionSelector>
          {onFormatCleared && (
            <ClearButton
              onClick={() => {
                this.setState({ active: false });
                onFormatCleared();
              }}
            >
              {"\u00A0"}
            </ClearButton>
          )}
          <CancelButton onClick={() => this.setState({ active: false })}>
            {"\u00A0"}
          </CancelButton>
        </AmountFormatWrapper>
      );
    }
  };
}

function _onDecimalCountChange(
  e: React.FormEvent<HTMLSelectElement>,
  selectedUnit: Unit.Unit<Quantity.Quantity>,
  onFormatChanged: OnFormatChanged
): void {
  const selectedIndex = e.currentTarget.selectedIndex;
  const selectedDecimalCount = selectedIndex;
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

function _onUnitChange(
  e: React.FormEvent<HTMLSelectElement>,
  units: Array<Unit.Unit<Quantity.Quantity>>,
  selectedDecimalCount: number,
  onFormatChanged: OnFormatChanged
): void {
  const selectedIndex = e.currentTarget.selectedIndex;
  const selectedUnit = units[selectedIndex];
  onFormatChanged(selectedUnit, selectedDecimalCount);
}

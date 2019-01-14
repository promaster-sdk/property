import * as React from "react";
import {
  PropertyValueSet,
  PropertyFilter,
  PropertyValue
} from "@promaster/property";
import { Amount, Unit, Quantity, UnitFormat } from "uom";
import * as PropertyFiltering from "@promaster/property-filter-pretty";
import {
  AmountFormatSelector,
  createAmountFormatSelector,
  OnFormatChanged,
  OnFormatCleared,
  OnFormatSelectorToggled
} from "./amount-format-selector";
import { AmountInputBox, createAmountInputBox } from "./amount-input-box";

// tslint:disable no-class no-this

export interface AmountPropertySelectorProps {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly inputUnit: Unit.Unit<Quantity.Quantity>;
  readonly inputDecimalCount: number;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly notNumericMessage: string;
  readonly isRequiredMessage: string;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly readOnly: boolean;
  readonly onFormatChanged: OnFormatChanged;
  readonly onFormatCleared: OnFormatCleared;
  readonly onFormatSelectorToggled?: OnFormatSelectorToggled;
  readonly onValueChange: (
    newValue: PropertyValue.PropertyValue | undefined
  ) => void;
  readonly debounceTime?: number;
  readonly fieldName: string;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
}

export type AmountPropertySelector = React.ComponentClass<
  AmountPropertySelectorProps
>;
export interface CreateAmountPropertySelectorProps {
  readonly AmountPropertySelectorWrapper?: React.ComponentType<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLSpanElement>,
      HTMLSpanElement
    >
  >;
  readonly AmountFormatSelector?: AmountFormatSelector;
  readonly AmountInputBox?: AmountInputBox;
}

const defaultAmountPropertySelectorWrapper = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >
) => <span {...props} />;

const defaultAmountFormatSelector = createAmountFormatSelector({});
const defaultAmountInputBox = createAmountInputBox({});

export function createAmountPropertySelector({
  AmountPropertySelectorWrapper = defaultAmountPropertySelectorWrapper,
  AmountFormatSelector = defaultAmountFormatSelector,
  AmountInputBox = defaultAmountInputBox
}: CreateAmountPropertySelectorProps): AmountPropertySelector {
  return class AmountPropertySelector extends React.Component<
    AmountPropertySelectorProps,
    {}
  > {
    render(): React.ReactElement<AmountPropertySelectorProps> {
      const {
        onValueChange,
        onFormatChanged,
        onFormatCleared,
        onFormatSelectorToggled,
        notNumericMessage,
        isRequiredMessage,
        validationFilter,
        propertyValueSet,
        propertyName,
        filterPrettyPrint,
        inputUnit,
        inputDecimalCount,
        readOnly,
        debounceTime = 350,
        unitsFormat
      } = this.props;

      const value:
        | Amount.Amount<Quantity.Quantity>
        | undefined = PropertyValueSet.getAmount(
        propertyName,
        propertyValueSet
      );

      return (
        <AmountPropertySelectorWrapper>
          <AmountInputBox
            value={value}
            inputUnit={inputUnit}
            inputDecimalCount={inputDecimalCount}
            notNumericMessage={notNumericMessage}
            isRequiredMessage={isRequiredMessage}
            errorMessage={_getValidationMessage(
              propertyValueSet,
              value,
              validationFilter,
              filterPrettyPrint
            )}
            readOnly={readOnly}
            onValueChange={newAmount =>
              onValueChange(
                newAmount !== undefined
                  ? PropertyValue.create("amount", newAmount)
                  : undefined
              )
            }
            debounceTime={debounceTime}
          />
          <AmountFormatSelector
            selectedUnit={inputUnit}
            selectedDecimalCount={inputDecimalCount}
            onFormatChanged={onFormatChanged}
            onFormatCleared={onFormatCleared}
            onFormatSelectorActiveChanged={onFormatSelectorToggled}
            unitsFormat={unitsFormat}
          />
        </AmountPropertySelectorWrapper>
      );
    }
  };
}

function _getValidationMessage(
  propertyValueSet: PropertyValueSet.PropertyValueSet,
  value: Amount.Amount<Quantity.Quantity> | undefined,
  validationFilter: PropertyFilter.PropertyFilter,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint
): string {
  if (!value || !validationFilter) {
    return "";
  }

  if (PropertyFilter.isValid(propertyValueSet, validationFilter)) {
    return "";
  } else {
    return filterPrettyPrint(validationFilter);
  }
}

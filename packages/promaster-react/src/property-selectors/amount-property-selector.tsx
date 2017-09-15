import * as React from "react";
import { Amount, PropertyValueSet, PropertyFilter, PropertyValue, Unit, Quantity } from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import {
  AmountFormatSelector,
  AmountInputBox,
  createAmountFormatSelector,
  createAmountInputBox,
  OnFormatChanged,
  OnFormatCleared,
  OnFormatSelectorToggled,
} from "../amount-fields/index";
import styled from "styled-components";

// tslint:disable no-class no-this

export interface AmountPropertySelectorProps {
  readonly propertyName: string,
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet,
  readonly inputUnit: Unit.Unit<Quantity.Quantity>,
  readonly inputDecimalCount: number,
  readonly validationFilter: PropertyFilter.PropertyFilter,
  readonly notNumericMessage: string,
  readonly isRequiredMessage: string,
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
  readonly readOnly: boolean,
  readonly onFormatChanged: OnFormatChanged,
  readonly onFormatCleared: OnFormatCleared,
  readonly onFormatSelectorToggled?: OnFormatSelectorToggled,
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void,
  readonly debounceTime?: number,
}

export type AmountPropertySelector = React.ComponentClass<AmountPropertySelectorProps>;
export interface CreateAmountPropertySelectorProps {
  readonly AmountPropertySelectorWrapper?: React.ComponentType<React.HTMLProps<HTMLSpanElement>>
  readonly AmountFormatSelector?: AmountFormatSelector,
  readonly AmountInputBox?: AmountInputBox,
}

const defaultAmountPropertySelectorWrapper = styled.span``;

const defaultAmountFormatSelector = createAmountFormatSelector({});
const defaultAmountInputBox = createAmountInputBox({});

export function createAmountPropertySelector({
  AmountPropertySelectorWrapper = defaultAmountPropertySelectorWrapper,
  AmountFormatSelector = defaultAmountFormatSelector,
  AmountInputBox = defaultAmountInputBox,
}: CreateAmountPropertySelectorProps): AmountPropertySelector {
  return class AmountPropertySelector extends React.Component<AmountPropertySelectorProps, {}> {

    render(): React.ReactElement<AmountPropertySelectorProps> {
      const {
        onValueChange,
        onFormatChanged,
        onFormatCleared,
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
    } = this.props;

      const value: Amount.Amount<Quantity.Quantity> | undefined = PropertyValueSet.getAmount(propertyName, propertyValueSet);

      return (
        <AmountPropertySelectorWrapper>
          <AmountInputBox value={value}
            inputUnit={inputUnit}
            inputDecimalCount={inputDecimalCount}
            notNumericMessage={notNumericMessage}
            isRequiredMessage={isRequiredMessage}
            errorMessage={_getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint)}
            readOnly={readOnly}
            onValueChange={(newAmount) =>
              onValueChange(newAmount !== undefined ? PropertyValue.create("amount", newAmount) : undefined)}
            debounceTime={debounceTime} />
          <AmountFormatSelector selectedUnit={inputUnit}
            selectedDecimalCount={inputDecimalCount}
            onFormatChanged={onFormatChanged}
            onFormatCleared={onFormatCleared} />
        </AmountPropertySelectorWrapper>
      );
    }
  };
}

function _getValidationMessage(propertyValueSet: PropertyValueSet.PropertyValueSet,
  value: Amount.Amount<Quantity.Quantity> | undefined,
  validationFilter: PropertyFilter.PropertyFilter,
  filterPrettyPrint: PropertyFiltering.FilterPrettyPrint): string {

  if (!value || !validationFilter) {
    return "";
  }

  if (PropertyFilter.isValid(propertyValueSet, validationFilter)) {
    return "";
  } else {
    return filterPrettyPrint(validationFilter);
  }
}

import * as React from "react";
import {Amount, PropertyValueSet, PropertyFilter, PropertyValue, Unit} from "promaster-primitives";
import {PropertyFiltering} from "promaster-portable";
import {AmountInputBox, AmountFormatSelector, OnFormatChanged} from "../amount-fields/index";
import {amountPropertySelectorStyles, AmountPropertySelectorStyles} from "./amount-property-selector-styles";

export interface AmountPropertySelectorProps {
  readonly propertyName: string,
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet,
  readonly inputUnit: Unit.Unit<any>,
  readonly inputDecimalCount: number,
  readonly validationFilter: PropertyFilter.PropertyFilter,
  readonly notNumericMessage: string,
  readonly isRequiredMessage: string,
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint,
  readonly readOnly: boolean,
  readonly onFormatChanged: OnFormatChanged,
  readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void,
  readonly styles?: AmountPropertySelectorStyles,
}

export class AmountPropertySelector extends React.Component<AmountPropertySelectorProps, any> {

  render() {
    const {
      onValueChange, onFormatChanged, notNumericMessage, isRequiredMessage,
      validationFilter, propertyValueSet, propertyName, filterPrettyPrint, inputUnit,
      inputDecimalCount, readOnly, styles = amountPropertySelectorStyles
    } = this.props;

    const value: Amount.Amount<any> | undefined = PropertyValueSet.getAmount(propertyName, propertyValueSet);
    if (!value) {
      throw new Error("Value is undefined");
    }

    return (
      <span className={styles.amount}>
          <AmountInputBox value={value}
                          inputUnit={inputUnit}
                          inputDecimalCount={inputDecimalCount}
                          notNumericMessage={notNumericMessage}
                          isRequiredMessage={isRequiredMessage}
                          errorMessage={_getValidationMessage(propertyValueSet, value, validationFilter, filterPrettyPrint)}
                          readOnly={readOnly}
                          onValueChange={(newAmount) =>
                            onValueChange(newAmount !== undefined ? PropertyValue.create("amount", newAmount): undefined)}
                          styles={styles.amountInputBoxStyles}/>
          <AmountFormatSelector selectedUnit={inputUnit}
                                selectedDecimalCount={inputDecimalCount}
                                onFormatChanged={onFormatChanged}
                                styles={styles.amountFormatSelectorStyles}/>
        </span>
    );
  }
}

function _getValidationMessage(propertyValueSet: PropertyValueSet.PropertyValueSet,
                               value: Amount.Amount<any>,
                               validationFilter: PropertyFilter.PropertyFilter,
                               filterPrettyPrint: PropertyFiltering.FilterPrettyPrint) {
  if (!value || !validationFilter) {
    return '';
  }

  if (PropertyFilter.isValid(propertyValueSet, validationFilter)) {
    return '';
  }
  else {
    return filterPrettyPrint(validationFilter);
  }
}

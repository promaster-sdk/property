/// <reference types="react" />
import * as React from "react";
import { PropertyValueSet, PropertyFilter, PropertyValue, Unit } from "promaster-primitives";
import { PropertyFiltering } from "promaster-portable";
import { OnFormatChanged, AmountFormatSelectorClassNames, AmountInputBoxClassNames } from "../amount-fields/index";
export interface AmountPropertySelectorProps {
    readonly propertyName: string;
    readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
    readonly inputUnit: Unit.Unit<any>;
    readonly inputDecimalCount: number;
    readonly validationFilter: PropertyFilter.PropertyFilter;
    readonly notNumericMessage: string;
    readonly isRequiredMessage: string;
    readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
    readonly readOnly: boolean;
    readonly onFormatChanged: OnFormatChanged;
    readonly onValueChange: (newValue: PropertyValue.PropertyValue | undefined) => void;
    readonly classNames: AmountPropertySelectorClassNames;
}
export interface AmountPropertySelectorClassNames {
    readonly amount: string;
    readonly amountFormatSelectorClassNames: AmountFormatSelectorClassNames;
    readonly amountInputBoxClassNames: AmountInputBoxClassNames;
}
export declare class AmountPropertySelector extends React.Component<AmountPropertySelectorProps, any> {
    render(): JSX.Element;
}

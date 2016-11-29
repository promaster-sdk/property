/// <reference types="react" />
import * as React from "react";
import { PropertyValueSet, PropertyFilter, PropertyValue, Unit } from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import { OnFormatChanged } from "../amount-fields/index";
import { AmountPropertySelectorStyles } from "./amount-property-selector-styles";
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
    readonly styles?: AmountPropertySelectorStyles;
}
export declare class AmountPropertySelector extends React.Component<AmountPropertySelectorProps, any> {
    render(): JSX.Element;
}

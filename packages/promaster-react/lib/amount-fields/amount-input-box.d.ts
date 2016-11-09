/// <reference types="react" />
import * as React from "react";
import { Amount, Unit } from "promaster-primitives";
import { AmountInputBoxStyles } from "./amount-input-box-styles";
export interface AmountInputBoxProps {
    readonly key?: string;
    readonly value: Amount.Amount<any>;
    readonly inputUnit: Unit.Unit<any>;
    readonly inputDecimalCount: number;
    readonly notNumericMessage: string;
    readonly isRequiredMessage: string;
    readonly errorMessage: string;
    readonly readOnly: boolean;
    readonly onValueChange: (newAmount: Amount.Amount<any>) => void;
    readonly styles?: AmountInputBoxStyles;
}
export interface State {
    readonly textValue: string;
    readonly isValid: boolean;
    readonly effectiveErrorMessage: string;
}
export declare class AmountInputBox extends React.Component<AmountInputBoxProps, State> {
    constructor();
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: AmountInputBoxProps): void;
    initStateFromProps(initProps: AmountInputBoxProps): void;
    render(): JSX.Element;
    _debouncedOnValueChange(newAmount: Amount.Amount<any>, onValueChange: (newAmount: Amount.Amount<any>) => void): void;
    _onChange(e: React.SyntheticEvent<any>, onValueChange: (newAmount: Amount.Amount<any>) => void): void;
    updateState(newAmount: Amount.Amount<any> | undefined, newStringValue: string): boolean;
}

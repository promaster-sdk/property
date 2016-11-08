/// <reference types="react" />
import * as React from "react";
import { Unit } from "promaster-primitives";
export interface AmountFormatSelectorProps {
    readonly key?: string;
    readonly selectedUnit: Unit.Unit<any>;
    readonly selectedDecimalCount: number;
    readonly onFormatChanged?: OnFormatChanged;
    readonly styles: AmountFormatSelectorStyles;
}
export interface AmountFormatSelectorStyles {
    readonly format: string;
    readonly formatActive: string;
    readonly unit: string;
    readonly precision: string;
    readonly cancel: string;
}
export interface State {
    readonly active: boolean;
}
export declare type OnFormatChanged = (unit: Unit.Unit<any>, decimalCount: number) => void;
export declare class AmountFormatSelector extends React.Component<AmountFormatSelectorProps, State> {
    constructor(props: AmountFormatSelectorProps);
    render(): JSX.Element;
}

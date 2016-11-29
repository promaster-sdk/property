/// <reference types="react" />
import * as React from "react";
import { Unit } from "@promaster/promaster-primitives";
import { AmountFormatSelectorStyles } from "./amount-format-selector-styles";
export interface AmountFormatSelectorProps {
    readonly key?: string;
    readonly selectedUnit: Unit.Unit<any>;
    readonly selectedDecimalCount: number;
    readonly onFormatChanged?: OnFormatChanged;
    readonly styles?: AmountFormatSelectorStyles;
}
export interface State {
    readonly active: boolean;
}
export declare type OnFormatChanged = (unit: Unit.Unit<any>, decimalCount: number) => void;
export declare class AmountFormatSelector extends React.Component<AmountFormatSelectorProps, State> {
    constructor(props: AmountFormatSelectorProps);
    render(): JSX.Element;
}

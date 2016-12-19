/// <reference types="react" />
import * as React from "react";
import { PropertyValue } from "@promaster/promaster-primitives";
import { TextboxPropertySelectorStyles } from "./textbox-property-selector-styles";
export interface TextboxPropertySelectorProps {
    readonly value: string;
    readonly readOnly: boolean;
    readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
    readonly styles?: TextboxPropertySelectorStyles;
    readonly debounceTime: number;
}
export interface State {
    readonly textValue: string;
}
export declare class TextboxPropertySelector extends React.Component<TextboxPropertySelectorProps, State> {
    constructor(props: TextboxPropertySelectorProps);
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: TextboxPropertySelectorProps): void;
    render(): JSX.Element;
    _debouncedOnValueChange(newValue: PropertyValue.PropertyValue, onValueChange: (newValue: PropertyValue.PropertyValue) => void): void;
    _onChange(e: React.SyntheticEvent<any>, onValueChange: (newValue: PropertyValue.PropertyValue) => void): void;
}

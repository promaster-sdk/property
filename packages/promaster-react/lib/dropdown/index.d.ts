/// <reference types="react" />
import * as React from "react";
export interface DropdownStyles {
    readonly dropdown: string;
    readonly dropdownButton: string;
    readonly dropdownBackground: string;
    readonly dropdownOptions: string;
    readonly dropdownOption: string;
}
export interface Props {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly options: Array<DropdownOption>;
    readonly styles?: DropdownStyles;
    readonly className?: string;
}
export interface DropdownOption {
    readonly value: string;
    readonly label: string;
    readonly tooltip?: string;
    readonly imageUrl?: string;
    readonly className?: string;
}
export interface State {
    readonly isOpen: boolean;
}
export declare class Dropdown extends React.Component<Props, State> {
    constructor(props: Props);
    render(): JSX.Element;
    _renderItem(item: DropdownOption | undefined): React.ReactElement<{}>;
}

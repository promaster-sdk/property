/// <reference types="react" />
import { TranslatePropertyLabelHover } from "./types";
export interface PropertyLabelComponentProps {
    selectorIsValid: boolean;
    selectorIsHidden: boolean;
    selectorLabel: string;
    translatePropertyLabelHover: TranslatePropertyLabelHover;
    propertyName: string;
}
export declare function DefaultPropertyLabelComponent({selectorIsValid, selectorIsHidden, selectorLabel, translatePropertyLabelHover, propertyName}: PropertyLabelComponentProps): JSX.Element;

/// <reference types="react" />
import * as React from "react";
import { PropertyValueSet } from "@promaster/promaster-primitives";
import { PropertyFiltering } from "@promaster/promaster-portable";
import { PropertySelectionOnChange, AmountFormat, OnPropertyFormatChanged, TranslatePropertyValue, TranslateNotNumericMessage, TranslateValueIsRequiredMessage, TranslatePropertyName, Property, TranslatePropertyLabelHover, TranslateGroupName, ReactComponent, OnToggleGroupClosed, PropertySelectorStyles } from "./types";
import { LayoutComponentProps } from "./default-layout-component";
import { GroupComponentProps } from "./default-group-component";
import { GroupItemComponentProps } from "./default-group-item-component";
import { PropertiesSelectorProps } from "./properties-selector";
import { PropertyLabelComponentProps } from "./default-property-label-component";
import { PropertySelectorComponentProps } from "./default-property-selector-component";
export interface PropertiesSelectorProps {
    readonly productProperties: Array<Property>;
    readonly selectedProperties: PropertyValueSet.PropertyValueSet;
    readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
    readonly includeCodes: boolean;
    readonly includeHiddenProperties: boolean;
    readonly autoSelectSingleValidValue: boolean;
    readonly onChange: PropertySelectionOnChange;
    readonly onPropertyFormatChanged: OnPropertyFormatChanged;
    readonly translatePropertyName: TranslatePropertyName;
    readonly translatePropertyValue: TranslatePropertyValue;
    readonly translateValueMustBeNumericMessage: TranslateNotNumericMessage;
    readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage;
    readonly translatePropertyLabelHover: TranslatePropertyLabelHover;
    readonly translateGroupName: TranslateGroupName;
    readonly readOnlyProperties: Array<string>;
    readonly optionalProperties: Array<string>;
    readonly propertyFormats: {
        [key: string]: AmountFormat;
    };
    readonly styles: PropertySelectorStyles;
    readonly closedGroups: Array<string>;
    readonly onToggleGroupClosed: OnToggleGroupClosed;
    readonly LayoutComponent?: ReactComponent<LayoutComponentProps>;
    readonly GroupComponent?: ReactComponent<GroupComponentProps>;
    readonly GroupItemComponent?: ReactComponent<GroupItemComponentProps>;
    readonly PropertySelectorComponent?: ReactComponent<PropertySelectorComponentProps>;
    readonly PropertyLabelComponent?: ReactComponent<PropertyLabelComponentProps>;
}
export declare function PropertiesSelector(props: PropertiesSelectorProps): React.ReactElement<PropertiesSelectorProps>;

/// <reference types="react" />
import * as React from "react";
import { PropertySelectorRenderInfo, ReactComponent } from "./types";
import { PropertyLabelComponentProps } from "./default-property-label-component";
import { PropertySelectorComponentProps } from "./default-property-selector-component";
export interface GroupItemComponentProps {
    readonly selector: PropertySelectorRenderInfo;
    readonly PropertySelectorComponent: ReactComponent<PropertySelectorComponentProps>;
    readonly PropertyLabelComponent: ReactComponent<PropertyLabelComponentProps>;
}
export declare function DefaultGroupItemComponent({selector, PropertyLabelComponent, PropertySelectorComponent}: GroupItemComponentProps): React.ReactElement<GroupItemComponentProps>;

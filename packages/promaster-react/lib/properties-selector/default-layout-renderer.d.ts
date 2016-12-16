/// <reference types="react" />
import { PropertySelectorRenderInfo, TranslateGroupName, OnToggleGroupClosed, ReactComponent } from "./types";
import { GroupComponentProps } from "./default-group-component";
import { GroupItemComponentProps } from "./default-group-item-component";
import { PropertyLabelComponentProps } from "./default-property-label-component";
import { PropertySelectorComponentProps } from "./default-property-selector-component";
export interface LayoutRendererProps {
    readonly selectors: Array<PropertySelectorRenderInfo>;
    readonly translateGroupName: TranslateGroupName;
    readonly closedGroups: Array<string>;
    readonly onToggleGroupClosed: OnToggleGroupClosed;
    readonly GroupComponent: ReactComponent<GroupComponentProps>;
    readonly GroupItemComponent: ReactComponent<GroupItemComponentProps>;
    readonly PropertySelectorComponent: ReactComponent<PropertySelectorComponentProps>;
    readonly PropertyLabelComponent: ReactComponent<PropertyLabelComponentProps>;
}
export declare function DefaultLayoutRenderer({selectors, translateGroupName, closedGroups, onToggleGroupClosed, GroupComponent, GroupItemComponent, PropertySelectorComponent, PropertyLabelComponent}: LayoutRendererProps): JSX.Element;

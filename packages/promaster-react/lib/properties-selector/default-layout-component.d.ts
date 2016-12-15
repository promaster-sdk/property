/// <reference types="react" />
import { PropertySelectorRenderInfo, TranslateGroupName, OnToggleGroupClosed, ReactComponent } from "./types";
import { GroupComponentProps } from "./default-group-component";
import { GroupItemComponentProps } from "./default-group-item-component";
import { PropertyLabelComponentProps } from "./default-property-label-component";
import { PropertySelectorComponentProps } from "./default-property-selector-component";
export interface LayoutComponentProps<TExtraProps> {
    readonly selectors: Array<PropertySelectorRenderInfo>;
    readonly translateGroupName: TranslateGroupName;
    readonly closedGroups: Array<string>;
    readonly onToggleGroupClosed: OnToggleGroupClosed;
    readonly GroupComponent: ReactComponent<GroupComponentProps>;
    readonly GroupItemComponent: ReactComponent<GroupItemComponentProps>;
    readonly PropertySelectorComponent: ReactComponent<PropertySelectorComponentProps>;
    readonly PropertyLabelComponent: ReactComponent<PropertyLabelComponentProps>;
    readonly ExtraProps: TExtraProps;
}
export interface DefaultLayoutExtraProps {
}
export declare function DefaultLayoutComponent({selectors, translateGroupName, closedGroups, onToggleGroupClosed, GroupComponent, GroupItemComponent, PropertySelectorComponent, PropertyLabelComponent}: LayoutComponentProps<DefaultLayoutExtraProps>): JSX.Element;

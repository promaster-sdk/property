/// <reference types="react" />
import * as React from "react";
import { OnToggleGroupClosed, TranslateGroupName } from "./types";
export interface GroupComponentProps {
    readonly isClosedGroup: boolean;
    readonly groupName: string;
    readonly onToggleGroupClosed: OnToggleGroupClosed;
    readonly translateGroupName: TranslateGroupName;
    readonly children?: Array<React.ReactElement<{}>>;
}
export declare function DefaultGroupComponent({isClosedGroup, groupName, onToggleGroupClosed, translateGroupName, children}: GroupComponentProps): JSX.Element;

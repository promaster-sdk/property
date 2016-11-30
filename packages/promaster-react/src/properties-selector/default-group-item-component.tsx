import * as React from "react";
import {PropertySelectorRenderInfo, ReactComponent} from "./types";
import {PropertyLabelComponentProps} from "./default-property-label-component";
import {PropertySelectorComponentProps} from "./default-property-selector-component";

export interface GroupItemComponentProps {
  readonly selector: PropertySelectorRenderInfo,
  readonly PropertySelectorComponent: ReactComponent<PropertySelectorComponentProps>,
  readonly PropertyLabelComponent: ReactComponent<PropertyLabelComponentProps>,
}

export function DefaultGroupItemComponent({
  selector,
  PropertyLabelComponent,
  PropertySelectorComponent,
}: GroupItemComponentProps): React.ReactElement<GroupItemComponentProps> {
  return (
    <div key={selector.propertyName} className="property-selector-row">
      <PropertyLabelComponent {...selector.labelComponentProps} />
      <PropertySelectorComponent {...selector.selectorComponentProps} />
    </div>
  );
}

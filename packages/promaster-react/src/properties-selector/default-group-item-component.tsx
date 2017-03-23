import * as React from "react";
import { PropertySelectorRenderInfo, ReactComponent } from "./types";
import { PropertyLabelComponentProps } from "./default-property-label-component";
import { PropertySelectorComponentProps } from "./default-property-selector-component";

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
    <tr key={selector.propertyName}>
      <td>
        <PropertyLabelComponent {...selector.labelComponentProps} />
      </td>
      <td>
        <PropertySelectorComponent {...selector.selectorComponentProps} />
      </td>
    </tr>
  );
}

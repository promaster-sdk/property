import * as React from "react";
import {RenderedPropertySelector} from "./types";
import {DefaultPropertyLabelComponent} from "./default-property-label-component";
import {DefaultPropertySelectorComponent} from "./default-property-selector-component";

export interface GroupItemComponentProps {
  readonly selector: RenderedPropertySelector,
}

export function DefaultGroupItemComponent({
  selector,
}: GroupItemComponentProps): React.ReactElement<GroupItemComponentProps> {
  return (
    <div key={selector.propertyName} className="property-selector-row">
      <DefaultPropertyLabelComponent {...selector.labelComponentProps} />
      <DefaultPropertySelectorComponent {...selector.selectorComponentProps} />
    </div>
  );
}

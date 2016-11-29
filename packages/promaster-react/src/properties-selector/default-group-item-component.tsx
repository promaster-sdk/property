import * as React from "react";
import {RenderedPropertySelector, RenderedPropertyLabel} from "./types";

export interface GroupItemComponentProps {
  readonly selector: RenderedPropertySelector,
  readonly label: RenderedPropertyLabel
}

export function DefaultGroupItemComponent({
  selector,
  label
}: GroupItemComponentProps): React.ReactElement<GroupItemComponentProps> {
  return (
    <div key={selector.propertyName} className="property-selector-row">
      {label}
      {selector.renderedSelectorElement}
    </div>
  );
}

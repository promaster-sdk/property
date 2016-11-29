import * as React from "react";
import {RenderedPropertySelector} from "./types";

export interface GroupItemComponentProps {
  readonly selector: RenderedPropertySelector,
}

export function DefaultGroupItemComponent({
  selector,
}: GroupItemComponentProps): React.ReactElement<GroupItemComponentProps> {
  return (
    <div key={selector.propertyName} className="property-selector-row">
      {selector.renderedLabelElement}
      {selector.renderedSelectorElement}
    </div>
  );
}

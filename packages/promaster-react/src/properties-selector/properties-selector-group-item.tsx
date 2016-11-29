import * as React from "react";
import {RenderedPropertySelector, RenderedPropertyLabel} from "./types";

export interface PropertiesSelectorGroupItemProps {
  selector: RenderedPropertySelector,
  label: RenderedPropertyLabel
}

export function PropertiesSelectorGroupItem({
  selector,
  label
}: PropertiesSelectorGroupItemProps): React.ReactElement<PropertiesSelectorGroupItemProps> {
  return (
    <div key={selector.propertyName} className="property-selector-row">
      {label}
      {selector.renderedSelectorElement}
    </div>
  );
}

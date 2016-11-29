import { RenderedPropertySelector } from "./types";
import { PropertiesSelectorProps } from "./properties-selector";
export declare function renderPropertySelectors({productProperties, selectedProperties, filterPrettyPrint, includeCodes, includeHiddenProperties, autoSelectSingleValidValue, onChange, onPropertyFormatChanged, translatePropertyName, translatePropertyValue, translateValueMustBeNumericMessage, translateValueIsRequiredMessage, readOnlyProperties, optionalProperties, propertyFormats, styles}: PropertiesSelectorProps): Array<RenderedPropertySelector>;

import { PropertyValueSet } from "promaster-primitives";
import { PropertyFiltering } from "promaster-portable";
import { RenderPropertySelectorsParametersStyles } from "./render-property-selectors-styles";
import { PropertySelectionOnChange, AmountFormat, OnPropertyFormatChanged, RenderedPropertySelector, TranslatePropertyValue, TranslateNotNumericMessage, TranslateValueIsRequiredMessage, TranslatePropertyName, Property } from "./types";
export interface RenderPropertySelectorsParameters {
    readonly productProperties: Array<Property>;
    readonly selectedProperties: PropertyValueSet.PropertyValueSet;
    readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
    readonly includeCodes: boolean;
    readonly includeHiddenProperties: boolean;
    readonly autoSelectSingleValidValue: boolean;
    readonly onChange: PropertySelectionOnChange;
    readonly onPropertyFormatChanged: OnPropertyFormatChanged;
    readonly translatePropertyName: TranslatePropertyName;
    readonly translatePropertyValue: TranslatePropertyValue;
    readonly translateValueMustBeNumericMessage: TranslateNotNumericMessage;
    readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage;
    readonly readOnlyProperties: Array<string>;
    readonly optionalProperties: Array<string>;
    readonly propertyFormats: {
        [key: string]: AmountFormat;
    };
    readonly styles: RenderPropertySelectorsParametersStyles;
}
export declare function renderPropertySelectors({productProperties, selectedProperties, filterPrettyPrint, includeCodes, includeHiddenProperties, autoSelectSingleValidValue, onChange, onPropertyFormatChanged, translatePropertyName, translatePropertyValue, translateValueMustBeNumericMessage, translateValueIsRequiredMessage, readOnlyProperties, optionalProperties, propertyFormats, styles}: RenderPropertySelectorsParameters): Array<RenderedPropertySelector>;

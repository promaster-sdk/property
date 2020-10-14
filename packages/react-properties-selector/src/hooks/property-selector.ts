// import React from "react";
import { Unit, UnitFormat } from "uom";
import {
  PropertyValueSet,
  // PropertyValue,
  PropertyFilter
} from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";
// import * as PropertySelectors from "@promaster-sdk/react-property-selectors";
import {
  PropertySelectorType,
  PropertySelectionOnChange,
  AmountFormat,
  OnPropertyFormatChanged,
  OnPropertyFormatCleared,
  OnPropertyFormatSelectorToggled,
  TranslatePropertyValue,
  TranslateNotNumericMessage,
  TranslateValueIsRequiredMessage,
  PropertyValueItem
} from "./types";

export type PropertySelectorProps = {
  readonly selectorType: PropertySelectorType;
  readonly fieldName: string;
  readonly propertyName: string;
  readonly quantity: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly valueItems: ReadonlyArray<PropertyValueItem>;
  readonly selectedProperties: PropertyValueSet.PropertyValueSet;
  readonly includeCodes: boolean;
  readonly optionalProperties: ReadonlyArray<string>;
  readonly onChange: PropertySelectionOnChange;
  readonly onPropertyFormatChanged: OnPropertyFormatChanged;
  readonly onPropertyFormatCleared: OnPropertyFormatCleared;
  readonly onPropertyFormatSelectorToggled: OnPropertyFormatSelectorToggled;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly propertyFormat: AmountFormat;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly translatePropertyValue: TranslatePropertyValue;
  readonly translateValueMustBeNumericMessage: TranslateNotNumericMessage;
  readonly translateValueIsRequiredMessage: TranslateValueIsRequiredMessage;
  readonly inputDebounceTime: number;
  readonly unitsFormat: {
    readonly [key: string]: UnitFormat.UnitFormat;
  };
  // readonly units: {
  //   readonly [key: string]: Unit.Unit;
  // };
  readonly units: Unit.UnitMap;
};

import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { action } from "@storybook/addon-actions";
import { exampleProductProperties } from "./example-product-properties";
import { units, unitsFormat } from "./units-map";

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

export function PropertiesSelectorExample1(): React.ReactElement<{}> {
  const [state, setState] = useState(PropertyValueSet.fromString("a=10:Meter;b=1;", unitLookup));

  const productProperties = exampleProductProperties();

  const sel = PropertiesSelector.usePropertiesSelector({
    units,
    unitsFormat,
    unitLookup,
    productProperties: productProperties,
    selectedProperties: state,
    onChange: (properties: PropertyValueSet.PropertyValueSet, _changedProperties: ReadonlyArray<string>) => {
      setState(properties);
      // console.log("updated: ", changedProperties);
    },
    onPropertyFormatSelectorToggled: action("toggle property format selector"),
  });

  // const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
  //   units,
  //   unitsFormat,
  //   unitLookup,
  //   productProperties: productProperties,
  //   selectedProperties: state,
  //   onChange: (properties: PropertyValueSet.PropertyValueSet, _changedProperties: ReadonlyArray<string>) => {
  //     setState(properties);
  //     // console.log("updated: ", changedProperties);
  //   },
  //   onPropertyFormatSelectorToggled: action("toggle property format selector"),
  // };

  console.log("propSel", sel);

  return (
    <div>
      <p>This example shows minimal configuration, using as much defaults as possible</p>
      <div>PropertyValueSet: {PropertyValueSet.toString(state)}</div>
      <div id="HOOKS">
        <div>
          {sel.groups.map((groupName) => {
            const isClosedGroup = sel.closedGroups.indexOf(groupName) !== -1;
            const renderedSelectorsForGroup = sel.selectors.filter(
              (selector) => selector.groupName === (groupName || "")
            );
            return (
              <div id="GroupComponent" key={groupName}>
                {groupName !== "" ? (
                  <div className="group-container-header" onClick={() => sel.onToggleGroupClosed(groupName)}>
                    <button className="expand-collapse">&nbsp;&gt;&gt;&nbsp;</button>
                    {sel.translateGroupName(groupName)}
                  </div>
                ) : (
                  ""
                )}
                <table>
                  <tbody>
                    {isClosedGroup
                      ? ""
                      : renderedSelectorsForGroup.map((selector) => (
                          <tr id="GroupItemComponent" key={selector.propertyName}>
                            <td>
                              {/* <PropertyLabelComponent
                                  {...selector.labelComponentProps}
                                /> */}
                              <label
                                id="PropertyLabelComponent"
                                className={!selector.isValid ? "invalid" : undefined}
                                // title={translatePropertyLabelHover(
                                //   selector.propertyName
                                // )}
                                title={selector.labelHover}
                              >
                                <span className={selector.isHidden ? "hidden-property" : ""}>{selector.label}</span>
                              </label>
                            </td>
                            <td>
                              {/* <PropertySelectorComponent
                                  {...selector.selectorComponentProps}
                                /> */}
                              <ThePropertySelector {...selector.selectorComponentProps} />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>
      {/* <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} /> */}
    </div>
  );
}

// Since we use hooks we need to put this in a separate component becuase hooks cannot be used in a loop
function ThePropertySelector({
  selectorType,
  // fieldName,
  // propertyName,
  quantity,
}: // validationFilter,
// valueItems,
// selectedProperties,
// includeCodes,
// optionalProperties,
// onChange,
// onPropertyFormatChanged,
// onPropertyFormatCleared,
// onPropertyFormatSelectorToggled,
// filterPrettyPrint,
// propertyFormat,
// readOnly,
// locked,
// translatePropertyValue,
// translateValueMustBeNumericMessage,
// translateValueIsRequiredMessage,
// inputDebounceTime,
// unitsFormat,
// units,
PropertiesSelector.PropertySelectorProps): JSX.Element {
  // function onValueChange(newValue: PropertyValue.PropertyValue): void {
  //   onChange(
  //     newValue
  //       ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
  //       : PropertyValueSet.removeProperty(propertyName, selectedProperties),
  //     propertyName
  //   );
  // }

  switch (getPropertyType(quantity)) {
    case "text":
      return (
        <div>TextboxPropertySelector</div>
        // <TextboxPropertySelector
        //   propertyName={propertyName}
        //   propertyValueSet={selectedProperties}
        //   readOnly={readOnly}
        //   onValueChange={onValueChange}
        //   debounceTime={inputDebounceTime}
        // />
      );

    case "integer":
      if (selectorType === "RadioGroup") {
        return (
          <div>RadioGroupPropertySelector</div>
          // <RadioGroupPropertySelector
          //   propertyName={propertyName}
          //   propertyValueSet={selectedProperties}
          //   valueItems={
          //     valueItems &&
          //     valueItems.map(vi => ({
          //       value: vi.value,
          //       text: translatePropertyValue(propertyName, (vi.value
          //         ? PropertyValue.getInteger(vi.value)
          //         : undefined) as number),
          //       sortNo: vi.sort_no,
          //       validationFilter: vi.property_filter,
          //       image: vi.image
          //     }))
          //   }
          //   showCodes={includeCodes}
          //   filterPrettyPrint={filterPrettyPrint}
          //   onValueChange={onValueChange}
          //   readOnly={readOnly}
          //   locked={locked}
          // />
        );
      } else if (selectorType === "Checkbox") {
        return (
          <div>CheckboxPropertySelector</div>
          // <CheckboxPropertySelector
          //   propertyName={propertyName}
          //   propertyValueSet={selectedProperties}
          //   valueItems={
          //     valueItems &&
          //     valueItems.map(vi => ({
          //       value: vi.value,
          //       text: translatePropertyValue(propertyName, (vi.value
          //         ? PropertyValue.getInteger(vi.value)
          //         : undefined) as number),
          //       sortNo: vi.sort_no,
          //       validationFilter: vi.property_filter,
          //       image: vi.image
          //     }))
          //   }
          //   showCodes={includeCodes}
          //   filterPrettyPrint={filterPrettyPrint}
          //   onValueChange={onValueChange}
          //   readOnly={readOnly}
          //   locked={locked}
          // />
        );
      } else {
        return (
          <div>ComboboxPropertySelector</div>
          // <ComboboxPropertySelector
          //   sortValidFirst={true}
          //   propertyName={propertyName}
          //   propertyValueSet={selectedProperties}
          //   valueItems={
          //     valueItems &&
          //     valueItems.map(vi => ({
          //       value: vi.value,
          //       text: translatePropertyValue(propertyName, (vi.value
          //         ? PropertyValue.getInteger(vi.value)
          //         : undefined) as number),
          //       sortNo: vi.sort_no,
          //       validationFilter: vi.property_filter,
          //       image: vi.image
          //     }))
          //   }
          //   showCodes={includeCodes}
          //   filterPrettyPrint={filterPrettyPrint}
          //   onValueChange={onValueChange}
          //   readOnly={readOnly}
          //   locked={locked}
          // />
        );
      }

    default:
      return (
        <div>AmountPropertySelector</div>
        // <AmountPropertySelector
        //   propertyName={propertyName}
        //   propertyValueSet={selectedProperties}
        //   inputUnit={propertyFormat.unit}
        //   inputDecimalCount={propertyFormat.decimalCount}
        //   onFormatChanged={(unit: Unit.Unit<unknown>, decimalCount: number) =>
        //     onPropertyFormatChanged(propertyName, unit, decimalCount)
        //   }
        //   onFormatCleared={() => onPropertyFormatCleared(propertyName)}
        //   onFormatSelectorToggled={(active: boolean) =>
        //     onPropertyFormatSelectorToggled(propertyName, active)
        //   }
        //   onValueChange={onValueChange}
        //   notNumericMessage={translateValueMustBeNumericMessage()}
        //   fieldName={fieldName}
        //   // If it is optional then use blank required message
        //   isRequiredMessage={
        //     optionalProperties &&
        //     optionalProperties.indexOf(propertyName) !== -1
        //       ? ""
        //       : translateValueIsRequiredMessage()
        //   }
        //   validationFilter={validationFilter}
        //   filterPrettyPrint={filterPrettyPrint}
        //   readOnly={readOnly}
        //   debounceTime={inputDebounceTime}
        //   unitsFormat={unitsFormat}
        //   units={units}
        // />
      );
  }

  // return <div>{props.propertyName}</div>;
}

function getPropertyType(quantity: string): PropertyValue.PropertyType {
  switch (quantity) {
    case "Text":
      return "text";
    case "Discrete":
      return "integer";
    default:
      return "amount";
  }
}

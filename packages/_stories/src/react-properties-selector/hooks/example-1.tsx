import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyValueSet, PropertyValue } from "@promaster-sdk/property";
import { action } from "@storybook/addon-actions";
import {
  getDefaultAmountInputBoxStyle,
  getDefaultCheckboxContainerStyle,
  getDefaultCheckboxStyle,
  getDefaultOptionStyle,
  getDefaultSelectStyle,
  useAmountPropertySelector,
  UseAmountPropertySelectorParams,
  useCheckboxPropertySelector,
  UseCheckboxPropertySelectorParams,
  useComboboxPropertySelector,
  UseComboboxPropertySelectorParams,
  useTextboxPropertySelector,
  UseTextboxPropertySelectorParams,
} from "@promaster-sdk/react-property-selectors";
import { exampleProductProperties } from "./example-product-properties";
import { units, unitsFormat } from "./units-map";

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

export function PropertiesSelectorExample1(): React.ReactElement<{}> {
  const [state, setState] = useState(PropertyValueSet.fromString("a=10:Meter;b=1;c=1;d=1;e=1;", unitLookup));

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

  return (
    <div>
      <p>This example shows minimal configuration, using as much defaults as possible</p>
      <div>PropertyValueSet: {PropertyValueSet.toString(state)}</div>
      <div id="HOOKS">
        <div>
          {sel.groups.map((group) => (
            <div id="GroupComponent" key={group.name}>
              {group.name && (
                <div className="group-container-header" onClick={() => sel.onToggleGroupClosed(group.name)}>
                  <button className="expand-collapse">&nbsp;&gt;&gt;&nbsp;</button>
                  {sel.translateGroupName(group.name)}
                </div>
              )}
              <table>
                <tbody>
                  {group.isClosed
                    ? ""
                    : group.selectors.map((selector) => (
                        <tr id="GroupItemComponent" key={selector.propertyName}>
                          <td>
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
                            <ThePropertySelector {...selector.selectorComponentProps} />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Since we use hooks we need to put this in a separate component becuase hooks cannot be used in a loop
function ThePropertySelector(props: PropertiesSelector.PropertySelectorProps): JSX.Element {
  const {
    quantity,
    selectorType,
    onChange,
    propertyName,
    selectedProperties,
    readOnly,
    inputDebounceTime,
    valueItems,
    translatePropertyValue,
    includeCodes,
    filterPrettyPrint,
    locked,
    propertyFormat,
    onPropertyFormatChanged,
    onPropertyFormatCleared,
    onPropertyFormatSelectorToggled,
    translateValueMustBeNumericMessage,
    fieldName,
    optionalProperties,
    translateValueIsRequiredMessage,
    validationFilter,
  } = props;

  function onValueChange(newValue: PropertyValue.PropertyValue): void {
    onChange(
      newValue
        ? PropertyValueSet.set(propertyName, newValue, selectedProperties)
        : PropertyValueSet.removeProperty(propertyName, selectedProperties),
      propertyName
    );
  }

  switch (getPropertyType(quantity)) {
    case "text": {
      return (
        <TheTextboxPropertySelector
          {...{
            propertyName,
            propertyValueSet: selectedProperties,
            readOnly,
            onValueChange,
            debounceTime: inputDebounceTime,
          }}
        />
      );
    }

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
          <TheCheckboxPropertySelector
            {...{
              propertyName,
              propertyValueSet: selectedProperties,
              valueItems:
                valueItems &&
                valueItems.map((vi) => ({
                  value: vi.value,
                  text: translatePropertyValue(propertyName, (vi.value
                    ? PropertyValue.getInteger(vi.value)
                    : undefined) as number),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image,
                })),
              showCodes: includeCodes,
              filterPrettyPrint,
              onValueChange,
              readOnly: readOnly,
              locked,
            }}
          />
        );
      } else {
        return (
          <TheComboboxPropertySelector
            {...{
              sortValidFirst: true,
              propertyName,
              propertyValueSet: selectedProperties,
              valueItems:
                valueItems &&
                valueItems.map((vi) => ({
                  value: vi.value,
                  text: translatePropertyValue(propertyName, (vi.value
                    ? PropertyValue.getInteger(vi.value)
                    : undefined) as number),
                  sortNo: vi.sort_no,
                  validationFilter: vi.property_filter,
                  image: vi.image,
                })),
              showCodes: includeCodes,
              filterPrettyPrint,
              onValueChange,
              readOnly,
              locked,
            }}
          />
        );
      }

    default: {
      return (
        <TheAmountPropertySelector
          {...{
            propertyName,
            propertyValueSet: selectedProperties,
            inputUnit: propertyFormat.unit,
            inputDecimalCount: propertyFormat.decimalCount,
            onFormatChanged: (unit: Unit.Unit<unknown>, decimalCount: number) =>
              onPropertyFormatChanged(propertyName, unit, decimalCount),
            onFormatCleared: () => onPropertyFormatCleared(propertyName),
            onFormatSelectorToggled: (active: boolean) => onPropertyFormatSelectorToggled(propertyName, active),
            onValueChange,
            notNumericMessage: translateValueMustBeNumericMessage(),
            fieldName: fieldName,
            // If it is optional then use blank required message
            isRequiredMessage:
              optionalProperties && optionalProperties.indexOf(propertyName) !== -1
                ? ""
                : translateValueIsRequiredMessage(),
            validationFilter,
            filterPrettyPrint,
            readonly: readOnly,
            debounceTime: inputDebounceTime,
            unitsFormat,
            units,
          }}
        />
      );
    }
  }
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

function TheAmountPropertySelector(props: UseAmountPropertySelectorParams): JSX.Element {
  const sel = useAmountPropertySelector(props);
  return (
    <span {...sel.getWrapperProps()}>
      <input {...sel.amountInputBox.getInputProps()} style={getDefaultAmountInputBoxStyle(sel.amountInputBox)} />
      <span {...sel.amountFormatSelector.getWrapperProps()}>
        {sel.amountFormatSelector.active ? (
          <>
            <select {...sel.amountFormatSelector.getUnitSelectorProps()}>
              {sel.amountFormatSelector.unitSelectorOptions.map((o) => (
                <option {...o.getOptionProps()}> {o.label} </option>
              ))}
            </select>
            <select {...sel.amountFormatSelector.getPrecisionSelectorProps()}>
              {sel.amountFormatSelector.precisionSelectorOptions.map((o) => (
                <option {...o.getOptionProps()}>{o.label}</option>
              ))}
            </select>
            {sel.amountFormatSelector.showClearButton && (
              <button {...sel.amountFormatSelector.getClearButtonProps()}>Cancel</button>
            )}
            <button {...sel.amountFormatSelector.getCancelButtonProps()}>Clear</button>
          </>
        ) : (
          sel.amountFormatSelector.label
        )}
      </span>
    </span>
  );
}

function TheCheckboxPropertySelector(props: UseCheckboxPropertySelectorParams): JSX.Element {
  const sel = useCheckboxPropertySelector(props);
  return (
    <div {...sel.getContainerDivProps()} style={getDefaultCheckboxContainerStyle()}>
      {sel.image && <img src={sel.image} />}
      <div>{sel.label}</div>
      <div {...sel.getCheckboxDivProps()} style={getDefaultCheckboxStyle(sel)} />
    </div>
  );
}

function TheTextboxPropertySelector(props: UseTextboxPropertySelectorParams): JSX.Element {
  const sel = useTextboxPropertySelector(props);
  return <input {...sel.getInputProps()} />;
}

function TheComboboxPropertySelector(props: UseComboboxPropertySelectorParams): JSX.Element {
  const sel = useComboboxPropertySelector(props);
  return (
    <select {...sel.getSelectProps()} style={{ ...getDefaultSelectStyle(sel) }}>
      {sel.options.map((o) => (
        <option {...o.getOptionProps()} style={getDefaultOptionStyle(o)} />
      ))}
    </select>
  );
}

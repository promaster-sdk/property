import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyValueSet } from "@promaster-sdk/property";
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
import { exhaustiveCheck } from "@promaster-sdk/property/lib/utils/exhaustive-check";
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
                  {group.name}
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
                              title={selector.propertyName}
                            >
                              <span className={selector.isHidden ? "hidden-property" : ""}>
                                {selector.propertyName}
                              </span>
                            </label>
                          </td>
                          <td>
                            {(() => {
                              // Need to put property selectors in separate components because their hooks cannt be declared in a loop
                              const sel = selector.selectorRenderInfo;
                              switch (sel.type) {
                                case "TextBox":
                                  return <TheTextboxPropertySelector {...sel.getUseTextboxParams()} />;
                                case "RadioGroup":
                                  return <div>RadioGroupPropertySelector</div>;
                                case "Checkbox":
                                  return <TheCheckboxPropertySelector {...sel.getUseCheckboxParams()} />;
                                case "ComboBox":
                                  return <TheComboboxPropertySelector {...sel.getUseComboboxParams()} />;
                                case "AmountField":
                                  return <TheAmountPropertySelector {...sel.getUseAmountParams()} />;
                                default:
                                  return exhaustiveCheck(sel, true);
                              }
                            })()}
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

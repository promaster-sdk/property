import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyValueSet } from "@promaster-sdk/property";
import {
  DiscretePropertySelector,
  DiscretePropertySelectorOptions,
  getDefaultAmountInputBoxStyle,
  getDefaultCheckboxContainerStyle,
  getDefaultCheckboxStyle,
  getDefaultListItemStyle,
  getDefaultListItemStyle2,
  getDefaultMenuStyle,
  getDefaultOptionStyle,
  getDefaultOptionStyle2,
  getDefaultRadioItemStyle,
  getDefaultSelectStyle,
  getDefaultSelectStyle2,
  getDefaultToggleButtonStyle,
  getDefaultToggleButtonStyle2,
  useAmountPropertySelector,
  UseAmountPropertySelectorOptions,
  useCheckboxPropertySelector,
  UseCheckboxPropertySelectorOptions,
  useComboboxPropertySelector,
  UseComboboxPropertySelectorOptions,
  useDiscretePropertySelector,
  useImageComboboxPropertySelector,
  UseImageComboboxPropertySelectorOptions,
  useRadioGroupPropertySelector,
  UseRadioGroupPropertySelectorOptions,
  useTextboxPropertySelector,
  UseTextboxPropertySelectorOptions,
} from "@promaster-sdk/react-property-selectors";
import { exhaustiveCheck } from "@promaster-sdk/property/lib/utils/exhaustive-check";
import { exampleProductProperties, SelectorTypes } from "./example-product-properties";
import { units, unitsFormat } from "./units-map";

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

export function PropertiesSelectorExample1(): React.ReactElement<{}> {
  const [pvs, setPvs] = useState(PropertyValueSet.fromString("a=10:Meter;b=1;", unitLookup));
  const [showCodes, setShowCodes] = useState(true);

  const propInfo = exampleProductProperties();

  const sel = PropertiesSelector.usePropertiesSelector({
    units,
    unitsFormat,
    unitLookup,
    productProperties: propInfo.properties,
    selectedProperties: pvs,
    onChange: (properties: PropertyValueSet.PropertyValueSet, _changedProperties: ReadonlyArray<string>) => {
      setPvs(properties);
      // console.log("updated: ", changedProperties);
    },
    showCodes,
  });

  return (
    <div>
      <p>This example shows minimal configuration, using as much defaults as possible</p>
      <div>
        <input
          type="checkbox"
          id="showCodes"
          name="vehicle1"
          checked={showCodes}
          onClick={() => setShowCodes(!showCodes)}
        />
        <label htmlFor="showCodes">Show Codes</label>
      </div>
      <div>PropertyValueSet: {PropertyValueSet.toString(pvs)}</div>
      <div>
        <div>
          {sel.groups.map((group) => (
            <div key={group.name}>
              {group.name && (
                <div>
                  <button {...group.getGroupToggleButtonProps()}>&nbsp;&gt;&gt;&nbsp;</button>
                  {translateGroupName(group.name)}
                </div>
              )}
              <table>
                <tbody>
                  {!group.isClosed &&
                    group.selectors.map((selector) => (
                      <tr key={selector.propertyName}>
                        <td>
                          <label
                            className={!selector.isValid ? "invalid" : undefined}
                            title={translatePropertyName(selector.propertyName)}
                          >
                            <span className={selector.isHidden ? "hidden-property" : ""}>
                              {selector.getPropertyLabel(translatePropertyName(selector.propertyName))}
                            </span>
                          </label>
                        </td>
                        <td>
                          {(() => {
                            // Need to put property selectors in separate components because their hooks cannt be declared in a loop
                            switch (selector.type) {
                              case "TextBox":
                                return <MyTextboxSelector {...selector.getUseTextboxOptions()} />;
                              case "RadioGroup":
                                return <MyRadioGroupSelector {...selector.getUseRadioGroupOptions()} />;
                              case "Checkbox":
                                return <MyCheckboxSelector {...selector.getUseCheckboxOptions()} />;
                              case "ComboBox":
                                return <MyComboboxSelector {...selector.getUseComboboxOptions()} />;
                              case "Discrete":
                                return (
                                  <MyDiscreteSelector
                                    selctorTypes={propInfo.selectorTypes}
                                    options={selector.getUseDiscreteOptions()}
                                  />
                                );
                              case "ImageComboBox":
                                return <MyImageComboboxSelector {...selector.getUseImageComboboxOptions()} />;
                              case "AmountField":
                                return <MyAmountSelector {...selector.getUseAmountOptions()} />;
                              default:
                                return exhaustiveCheck(selector, true);
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

function MyDiscreteSelector({
  selctorTypes,
  options,
}: {
  readonly selctorTypes: SelectorTypes;
  readonly options: DiscretePropertySelectorOptions;
}): JSX.Element {
  const sel = useDiscretePropertySelector(options);
  switch (selctorTypes[options.propertyName]) {
    case "RadioGroup":
      return <div>RadioGroup</div>;
    case "Checkbox":
      return <div>Checkbox</div>;
    default:
      if (sel.hasOptionImage) {
        return <MyDiscreteImageComboboxSelector {...sel} />;
      }
      return <MyDiscreteComboboxSelector {...sel} />;
  }
}

function MyDiscreteComboboxSelector(sel: DiscretePropertySelector): JSX.Element {
  return (
    <select {...sel.getSelectProps()} style={{ ...getDefaultSelectStyle2(sel) }}>
      {sel.items.map((o) => (
        <option {...sel.getOptionProps(o)} style={getDefaultOptionStyle2(sel, o)} />
      ))}
    </select>
  );
}

function MyDiscreteImageComboboxSelector(sel: DiscretePropertySelector): JSX.Element {
  return (
    <div style={{ userSelect: "none" }}>
      <button {...sel.getToggleButtonProps()} style={getDefaultToggleButtonStyle2(sel)}>
        <span>
          {sel.selectedItem.image && <img src={sel.selectedItem.image} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
          {" " + sel.getItemLabel(sel.selectedItem) + " "}
        </span>
        <i className="fa fa-caret-down" />
      </button>
      {/* optionsList */}
      {sel.isOpen && (
        <ul id="DropdownOptionsElement" style={getDefaultMenuStyle()}>
          {sel.items.map((o) => (
            <li {...sel.getListItemProps(o)} style={getDefaultListItemStyle2(sel, o)}>
              <span>
                {o.image && <img src={o.image} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
                {" " + sel.getItemLabel(o) + " "}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MyAmountSelector(props: UseAmountPropertySelectorOptions): JSX.Element {
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

function MyCheckboxSelector(props: UseCheckboxPropertySelectorOptions): JSX.Element {
  const sel = useCheckboxPropertySelector(props);
  return (
    <div {...sel.getContainerDivProps()} style={getDefaultCheckboxContainerStyle()}>
      {sel.image && <img src={sel.image} />}
      <div>{sel.label}</div>
      <div {...sel.getCheckboxDivProps()} style={getDefaultCheckboxStyle(sel)} />
    </div>
  );
}

function MyTextboxSelector(props: UseTextboxPropertySelectorOptions): JSX.Element {
  const sel = useTextboxPropertySelector(props);
  return <input {...sel.getInputProps()} />;
}

function MyComboboxSelector(props: UseComboboxPropertySelectorOptions): JSX.Element {
  const sel = useComboboxPropertySelector(props);
  return (
    <select {...sel.getSelectProps()} style={{ ...getDefaultSelectStyle(sel) }}>
      {sel.options.map((o) => (
        <option {...o.getOptionProps()} style={getDefaultOptionStyle(o)} />
      ))}
    </select>
  );
}

function MyImageComboboxSelector(props: UseImageComboboxPropertySelectorOptions): JSX.Element {
  const sel = useImageComboboxPropertySelector(props);
  return (
    <div style={{ userSelect: "none" }}>
      <button {...sel.getToggleButtonProps()} style={getDefaultToggleButtonStyle(sel)}>
        <span>
          {sel.imageUrl && <img src={sel.imageUrl} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
          {" " + sel.label + " "}
        </span>
        <i className="fa fa-caret-down" />
      </button>
      {/* optionsList */}
      {sel.isOpen && (
        <ul id="DropdownOptionsElement" style={getDefaultMenuStyle()}>
          {sel.items.map((o) => (
            <li {...o.getItemProps()} style={getDefaultListItemStyle(o)}>
              <span>
                {o.imageUrl && <img src={o.imageUrl} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
                {" " + o.label + " "}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MyRadioGroupSelector(props: UseRadioGroupPropertySelectorOptions): JSX.Element {
  const sel = useRadioGroupPropertySelector(props);
  return (
    <div {...sel.getGroupProps()}>
      {sel.items.map((item) => (
        <div {...item.getItemProps()} title={item.toolTip} style={getDefaultRadioItemStyle(item)}>
          {item.imageUrl ? <img src={item.imageUrl} /> : undefined}
          {item.label}
        </div>
      ))}
    </div>
  );
}

function translateGroupName(groupName: string): string {
  return "group_" + groupName;
}

function translatePropertyName(propertyName: string): string {
  return "property_" + propertyName;
}

// const label = translatePropertyName(property.name) + (includeCodes ? " (" + property.name + ")" : "");
// const labelHover = translatePropertyLabelHover(property.name);

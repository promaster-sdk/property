import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyValueSet } from "@promaster-sdk/property";
import {
  DiscretePropertySelector,
  DiscretePropertySelectorOptions,
  getDefaultAmountInputBoxStyle,
  getDefaultCheckboxContainerStyle2,
  getDefaultCheckboxStyle2,
  getDefaultListItemStyle2,
  getDefaultMenuStyle,
  getDefaultOptionStyle2,
  getDefaultRadioItemStyle2,
  getDefaultSelectStyle2,
  getDefaultToggleButtonStyle2,
  useAmountPropertySelector,
  UseAmountPropertySelectorOptions,
  useDiscretePropertySelector,
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
                              case "Discrete":
                                return (
                                  <MyDiscreteSelector
                                    selctorTypes={propInfo.selectorTypes}
                                    options={selector.getUseDiscreteOptions()}
                                  />
                                );
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
      return <MyDiscreteRadioGroupSelector {...sel} />;
    case "Checkbox":
      return <MyDiscreteCheckboxSelector {...sel} />;
    default:
      if (sel.hasOptionImage) {
        return <MyDiscreteImageComboboxSelector {...sel} />;
      }
      return <MyDiscreteComboboxSelector {...sel} />;
  }
}

function MyDiscreteCheckboxSelector(sel: DiscretePropertySelector): JSX.Element {
  return (
    <div {...sel.getCheckboxDivProps()} style={getDefaultCheckboxContainerStyle2()}>
      {sel.selectedItem.image && <img src={sel.selectedItem.image} />}
      <div>{sel.getItemLabel(sel.selectedItem)}</div>
      <div style={getDefaultCheckboxStyle2(sel)} />
    </div>
  );
}

function MyDiscreteRadioGroupSelector(sel: DiscretePropertySelector): JSX.Element {
  return (
    <div>
      {sel.items
        .filter((i) => !!i.value)
        .map((item) => (
          <div
            {...sel.getRadioItemProps(item)}
            title={sel.getItemToolTip(item)}
            style={getDefaultRadioItemStyle2(sel, item)}
          >
            {item.image ? <img src={item.image} /> : undefined}
            {sel.getItemLabel(item)}
          </div>
        ))}
    </div>
  );
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

function MyTextboxSelector(props: UseTextboxPropertySelectorOptions): JSX.Element {
  const sel = useTextboxPropertySelector(props);
  return <input {...sel.getInputProps()} />;
}

function translateGroupName(groupName: string): string {
  return "group_" + groupName;
}

function translatePropertyName(propertyName: string): string {
  return "property_" + propertyName;
}

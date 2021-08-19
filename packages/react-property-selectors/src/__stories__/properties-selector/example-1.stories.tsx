import React, { useState } from "react";
import { Meta } from "@storybook/react";
import { BaseUnits, UnitMap } from "uom";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { PropertyFilter, PropertyValueSet } from "@promaster-sdk/property";
import {
  AmountPropertyInfo,
  DiscretePropertyInfo,
  usePropertiesSelector,
  UsePropertiesSelectorOptions,
} from "../../properties-selector";
import {
  exampleProductProperties,
  MyPropertyValueDef,
  MyPropertyDef,
  MyAmountPropertyDef,
} from "../selector-ui/example-product-properties";
import { MyAmountSelector, MyDiscreteSelector, MyTextboxSelector } from "../selector-ui/selector-ui";
import { SelectableFormat, UnitLabels } from "../../amount";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

export type PropertyFormats = { readonly [propertyName: string]: SelectableFormat };

export function Example1(): React.ReactElement<{}> {
  const [pvs, setPvs] = useState(PropertyValueSet.fromString("a=10:Meter;b=1;", unitLookup));
  const [showCodes, setShowCodes] = useState(true);
  const [selectedPropertyFormats, setPropertyFormats] = useState<PropertyFormats>({});

  const propInfo = exampleProductProperties();

  const unitLabels: UnitLabels = {
    Meter: "m",
    CentiMeter: "cm",
    Millimeter: "mm",
  };

  const selOptions: UsePropertiesSelectorOptions<MyPropertyDef, MyPropertyValueDef> = {
    onPropertyFormatChanged: (propertyName, selectedFormat) => {
      setPropertyFormats({
        ...selectedPropertyFormats,
        [propertyName]: selectedFormat,
      });
    },
    onPropertyFormatCleared: (propertyName) => {
      const firstFormat = (propInfo.properties.filter((pi) => pi.type === "Amount") as ReadonlyArray<
        MyAmountPropertyDef
      >).find((pi) => pi.name === propertyName)?.selectableFormats[0];
      if (firstFormat) {
        setPropertyFormats({ ...selectedPropertyFormats, [propertyName]: firstFormat });
      } else {
        // TODO
      }
    },
    properties: propInfo.properties,
    selectedProperties: pvs,
    onChange: (properties: PropertyValueSet.PropertyValueSet, _changedProperties: ReadonlyArray<string>) => {
      setPvs(properties);
    },
    getUndefinedValueItem: () => ({
      value: undefined,
      sortNo: -1,
      text: "",
      validationFilter: PropertyFilter.Empty,
    }),
    showCodes,
    getItemValue: (item) => item.value,
    getItemFilter: (item) => item.validationFilter,
    getPropertyInfo: (p) => {
      switch (p.type) {
        case "Amount": {
          const retVal: AmountPropertyInfo = {
            type: p.type,
            name: p.name,
            group: p.group,
            quantity: p.type,
            validationFilter: p.validationFilter,
            visibilityFilter: p.visibilityFilter,
            selectableFormats: p.selectableFormats,
            selectedFormat: selectedPropertyFormats[p.name] ?? p.selectableFormats[0],
          };

          return retVal;
        }

        case "Discrete": {
          const retVal: DiscretePropertyInfo<MyPropertyValueDef> = {
            type: p.type,
            name: p.name,
            group: p.group,
            quantity: p.type,
            validationFilter: p.validationFilter,
            visibilityFilter: p.visibilityFilter,
            values: [],
          };
          return retVal;
        }
        default:
          return exhaustiveCheck(p, true);
      }
    },
    getPropertyItems: (p) => p.items,
    unitLables: unitLabels,
  };

  const sel = usePropertiesSelector(selOptions);

  return (
    <div>
      <p>This example shows minimal configuration, using as much defaults as possible</p>
      <div>
        <input
          type="checkbox"
          id="showCodes"
          name="vehicle1"
          checked={showCodes}
          onChange={() => setShowCodes(!showCodes)}
        />
        <label htmlFor="showCodes">Show Codes</label>
      </div>
      <div>PropertyValueSet: {PropertyValueSet.toString(pvs)}</div>
      <div>
        <div>
          {sel.groups.map((group) => (
            <div key={group}>
              {group !== "" && (
                <div>
                  <button {...sel.getGroupToggleButtonProps(group)}>&nbsp;&gt;&gt;&nbsp;</button>
                  {translateGroupName(group)}
                </div>
              )}
              <table>
                <tbody>
                  {!sel.isGroupClosed(group) &&
                    sel.getGroupProperties(group).map((property) => {
                      const selector = sel.getPropertySelectorHook(property);
                      return (
                        <tr key={property.name}>
                          <td>
                            <label
                              className={!sel.isPropertyValid(property) ? "invalid" : undefined}
                              title={translatePropertyName(property.name)}
                            >
                              <span className={sel.isPropertyHidden(property) ? "hidden-property" : ""}>
                                {sel.getPropertyLabel(property, translatePropertyName(property.name))}
                              </span>
                            </label>
                          </td>
                          <td>
                            {(() => {
                              // Need to put property selectors in separate components because their hooks cannt be declared in a loop
                              switch (selector.type) {
                                case "TextBox":
                                  return <MyTextboxSelector {...selector.getUseTextboxOptions()} />;
                                case "Discrete": {
                                  const selectorT = selector;
                                  if (property.type === "Discrete") {
                                    return (
                                      <MyDiscreteSelector
                                        selectorType={property.selectorType}
                                        options={selector.getUseDiscreteOptions()}
                                      />
                                    );
                                  } else {
                                    return <div></div>;
                                  }
                                }
                                case "AmountField": {
                                  return <MyAmountSelector {...selector.getUseAmountOptions()} />;
                                }
                                default:
                                  return exhaustiveCheck(selector, true);
                              }
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function translateGroupName(groupName: string): string {
  return "group_" + groupName;
}

function translatePropertyName(propertyName: string): string {
  return "property_" + propertyName;
}

// eslint-disable-next-line import/no-default-export
export default {
  component: Example1,
  title: "HOOKS/Properties Selector",
} as Meta;

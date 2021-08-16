import React, { useState } from "react";
import { Meta } from "@storybook/react";
import { BaseUnits, UnitMap } from "uom";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { PropertyFilter, PropertyValueSet } from "@promaster-sdk/property";
import { PropertyFormats, usePropertiesSelector, UsePropertiesSelectorOptions } from "../../properties-selector";
import { exampleProductProperties, MyItem, MyPropertyInfo } from "../selector-ui/example-product-properties";
// import { units, unitsFormat } from "../units-map";
import { MyAmountSelector, MyDiscreteSelector, MyTextboxSelector } from "../selector-ui/selector-ui";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

export function Example1(): React.ReactElement<{}> {
  const [pvs, setPvs] = useState(PropertyValueSet.fromString("a=10:Meter;b=1;", unitLookup));
  const [showCodes, setShowCodes] = useState(true);
  const [selectedPropertyFormats, setPropertyFormats] = useState<PropertyFormats>({});

  const propInfo = exampleProductProperties();

  const selOptions: UsePropertiesSelectorOptions<MyItem, MyPropertyInfo> = {
    onPropertyFormatChanged: (propertyName, selectedUnitIndex, selectedDecimalCountIndex) => {
      setPropertyFormats({
        ...selectedPropertyFormats,
        [propertyName]: { selectedUnitIndex, selectedDecimalCountIndex },
      });
    },
    onPropertyFormatCleared: (propertyName) => {
      setPropertyFormats({
        ...selectedPropertyFormats,
        [propertyName]: { selectedUnitIndex: 0, selectedDecimalCountIndex: 0 },
      });
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
      return { ...p, ...selectedPropertyFormats[p.name] };
    },
    getPropertyItems: (p) => p.items,
  };

  const sel = usePropertiesSelector<MyItem, MyPropertyInfo>(selOptions);

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
                                case "Discrete":
                                  return (
                                    <MyDiscreteSelector
                                      selectorType={property.selectorType}
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

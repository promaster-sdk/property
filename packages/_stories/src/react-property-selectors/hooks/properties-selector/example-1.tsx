import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import { exhaustiveCheck } from "ts-exhaustive-check";
import { PropertyFilter, PropertyValueSet } from "@promaster-sdk/property";
import { usePropertiesSelector } from "@promaster-sdk/react-property-selectors";
import { exampleProductProperties } from "../selector-ui/example-product-properties";
import { units, unitsFormat } from "./units-map";
import { MyAmountSelector, MyDiscreteSelector, MyTextboxSelector } from "../selector-ui/selector-ui";

const unitLookup: Unit.UnitLookup = (unitString) => (BaseUnits as Unit.UnitMap)[unitString];

export function PropertiesSelectorExample1(): React.ReactElement<{}> {
  const [pvs, setPvs] = useState(PropertyValueSet.fromString("a=10:Meter;b=1;", unitLookup));
  const [showCodes, setShowCodes] = useState(true);

  const propInfo = exampleProductProperties();

  const sel = usePropertiesSelector({
    units,
    unitsFormat,
    unitLookup,
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
    getPropertyInfo: (p) => p,
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

function translateGroupName(groupName: string): string {
  return "group_" + groupName;
}

function translatePropertyName(propertyName: string): string {
  return "property_" + propertyName;
}

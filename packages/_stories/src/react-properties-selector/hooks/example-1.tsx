/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import React, { useState } from "react";
import { BaseUnits, Unit } from "uom";
import * as PropertiesSelector from "@promaster-sdk/react-properties-selector";
import { PropertyValueSet } from "@promaster-sdk/property";
import { action } from "@storybook/addon-actions";
import { exampleProductProperties } from "./example-product-properties";
import { units, unitsFormat } from "./units-map";

const unitLookup: Unit.UnitLookup = unitString =>
  (BaseUnits as Unit.UnitMap)[unitString];

interface State {
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
}

export class PropertiesSelectorExample12 extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      propertyValueSet: PropertyValueSet.fromString(
        "a=10:Meter;b=1;",
        unitLookup
      )
    };
  }
}

export function PropertiesSelectorExample1(): React.ReactElement<{}> {
  const [state, setState] = useState(
    PropertyValueSet.fromString("a=10:Meter;b=1;", unitLookup)
  );

  const productProperties = exampleProductProperties();

  const sel = PropertiesSelector.usePropertiesSelector({
    units,
    unitsFormat,
    unitLookup,
    productProperties: productProperties,
    selectedProperties: state,
    onChange: (
      properties: PropertyValueSet.PropertyValueSet,
      _changedProperties: ReadonlyArray<string>
    ) => {
      setState(properties);
      // console.log("updated: ", changedProperties);
    },
    onPropertyFormatSelectorToggled: action("toggle property format selector")
  });

  const propertiesSelectorProps: PropertiesSelector.PropertiesSelectorProps = {
    units,
    unitsFormat,
    unitLookup,
    productProperties: productProperties,
    selectedProperties: state,
    onChange: (
      properties: PropertyValueSet.PropertyValueSet,
      _changedProperties: ReadonlyArray<string>
    ) => {
      setState(properties);
      // console.log("updated: ", changedProperties);
    },
    onPropertyFormatSelectorToggled: action("toggle property format selector")
  };

  console.log("propSel", sel);

  return (
    <div>
      <p>
        This example shows minimal configuration, using as much defaults as
        possible
      </p>
      <div>PropertyValueSet: {PropertyValueSet.toString(state)}</div>
      <div id="HOOKS">
        <div>
          {sel.groups.map(groupName => {
            const isClosedGroup = sel.closedGroups.indexOf(groupName) !== -1;
            const renderedSelectorsForGroup = sel.selectors.filter(
              selector => selector.groupName === (groupName || "")
            );
            return (
              <>
                <div id="GroupComponent" key={groupName}>
                  {groupName !== "" ? (
                    <div
                      className="group-container-header"
                      onClick={() => sel.onToggleGroupClosed(groupName)}
                    >
                      <button className="expand-collapse">
                        &nbsp;&gt;&gt;&nbsp;
                      </button>
                      {sel.translateGroupName(groupName)}
                    </div>
                  ) : (
                    ""
                  )}
                  <table>
                    <tbody>
                      {isClosedGroup
                        ? ""
                        : renderedSelectorsForGroup.map(selector => (
                            // `OLLE!! GroupItemComponent ${
                            //   selector.propertyName
                            // }`
                            // <GroupItemComponent
                            //   key={selector.propertyName}
                            //   selector={selector}
                            //   PropertySelectorComponent={
                            //     PropertySelectorComponent
                            //   }
                            //   PropertyLabelComponent={PropertyLabelComponent}
                            // />
                            <tr
                              id="GroupItemComponent"
                              key={selector.propertyName}
                            >
                              <td>
                                {/* <PropertyLabelComponent
                                  {...selector.labelComponentProps}
                                /> */}
                                <label
                                  id="PropertyLabelComponent"
                                  className={
                                    !selector.isValid ? "invalid" : undefined
                                  }
                                  // title={translatePropertyLabelHover(
                                  //   selector.propertyName
                                  // )}
                                  title={selector.labelHover}
                                >
                                  <span
                                    className={
                                      selector.isHidden ? "hidden-property" : ""
                                    }
                                  >
                                    {selector.label}
                                  </span>
                                </label>
                              </td>
                              <td>
                                {/* <PropertySelectorComponent
                                  {...selector.selectorComponentProps}
                                /> */}
                                PropertySelectorComponent
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                {/* <GroupComponent
                  key={groupName}
                  isClosedGroup={isClosedGroup}
                  groupName={groupName}
                  onToggleGroupClosed={onToggleGroupClosed}
                  translateGroupName={translateGroupName}
                > */}
                {/* {renderedSelectorsForGroup.map((selector) => (
                  <GroupItemComponent
                    key={selector.propertyName}
                    selector={selector}
                    PropertySelectorComponent={PropertySelectorComponent}
                    PropertyLabelComponent={PropertyLabelComponent}
                  />
                ))} */}
                {/* </GroupComponent> */}
              </>
            );
          })}
        </div>
      </div>
      <PropertiesSelector.PropertiesSelector {...propertiesSelectorProps} />
    </div>
  );
}

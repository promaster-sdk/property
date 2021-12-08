import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import { Meta } from "@storybook/react";
import React, { Fragment, useState } from "react";
import { BaseUnits, UnitMap } from "uom";
import { getDefaultListItemStyle, getDefaultSelectStyle } from "../../discrete/default-styles";
import {
  DiscretePropertySelectorOptions,
  useDiscretePropertySelector,
} from "../../discrete/use-discrete-property-selector";
import { usePropertiesSelector, UsePropertiesSelectorOptions } from "../../properties-selector/use-properties-selector";

type PropertyValueDef = {
  readonly sortNo: number;
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly text: string;
};

type PropertyDef = {
  readonly sortNo: number;
  readonly name: string;
  readonly group: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly visibilityFilter: PropertyFilter.PropertyFilter;
  readonly items: ReadonlyArray<PropertyValueDef>;
};

export type DiscretePropertyInfo<TPropertyValueDef> = {
  readonly type: "Discrete";
  readonly name: string;
  readonly group: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
  readonly visibilityFilter: PropertyFilter.PropertyFilter;
  readonly items: ReadonlyArray<TPropertyValueDef>;
};

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

function getExampleProductProperties(): {
  readonly properties: ReadonlyArray<PropertyDef>;
} {
  return {
    properties: [
      {
        sortNo: 1,
        name: "a",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 10,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.Empty,
            text: "a_1",
          },
          {
            sortNo: 20,
            value: PropertyValue.fromInteger(2),
            validationFilter: PropertyFilter.fromString("b=2", unitLookup) || PropertyFilter.Empty,
            text: "a_2",
          },
        ],
      },
      {
        sortNo: 2,
        name: "b",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 10,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.Empty,
            text: "b_1",
          },
          {
            sortNo: 20,
            value: PropertyValue.fromInteger(2),
            validationFilter: PropertyFilter.Empty,
            text: "b_2",
          },
        ],
      },
    ],
  };
}
const propInfo = getExampleProductProperties();

type UnitLabels = {
  readonly [unitName: string]: string;
};

const unitLabels: UnitLabels = {
  Meter: "m",
  CentiMeter: "cm",
  Millimeter: "mm",
};

export function Example2(): React.ReactElement<{}> {
  const [pvs, setPvs] = useState(PropertyValueSet.fromString("a=2;b=2;", unitLookup));
  const [autoSelectSingleValidValue, setAutoSelectSingleValidValue] = useState(true);
  const [lockSingleValidValue, setLockSingleValidValue] = useState(true);

  const selOptions: UsePropertiesSelectorOptions<PropertyDef, PropertyValueDef> = {
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
    getItemValue: (item) => item.value,
    getItemFilter: (item) => item.validationFilter,
    getPropertyInfo: (p) => {
      const retVal: DiscretePropertyInfo<PropertyValueDef> = {
        type: "Discrete",
        name: p.name,
        group: p.group,
        validationFilter: p.validationFilter,
        visibilityFilter: p.visibilityFilter,
        items: p.items,
      };
      return retVal;
    },
    unitLables: unitLabels,
    autoSelectSingleValidValue: false,
    lockSingleValidValue: true,
  };

  const sel = usePropertiesSelector(selOptions);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          <input
            type="checkbox"
            id="autoSelectSingleValidValue"
            checked={autoSelectSingleValidValue}
            onChange={() => setAutoSelectSingleValidValue(!autoSelectSingleValidValue)}
          />
          <label htmlFor="autoSelectSingleValidValue">autoSelectSingleValidValue</label>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <input
            type="checkbox"
            id="lockSingleValidValue"
            checked={lockSingleValidValue}
            onChange={() => setLockSingleValidValue(!lockSingleValidValue)}
          />
          <label htmlFor="lockSingleValidValue">lockSingleValidValue</label>
        </div>
      </div>
      <span>PropertyValueSet: {PropertyValueSet.toString(pvs)}</span>
      <span>a_2 validationFilter: b=2</span>
      {sel.groups.map((group) => (
        <Fragment key={group}>
          {sel.getGroupProperties(group).map((property) => {
            const selectorInfo = sel.getPropertySelectorHookInfo(property);
            return (
              <Fragment key={property.name}>
                {selectorInfo.type === "Discrete" && (
                  <Select propertyName={property.name} options={selectorInfo.getUseDiscreteOptions()} />
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

function Select({
  options,
  propertyName,
}: {
  readonly options: DiscretePropertySelectorOptions<PropertyValueDef>;
  readonly propertyName: string;
}): JSX.Element {
  const discreteSelector = useDiscretePropertySelector(options);
  return (
    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
      <span>{propertyName}:</span>
      <select
        data-testid={propertyName}
        {...discreteSelector.getSelectProps()}
        style={{ ...getDefaultSelectStyle(discreteSelector) }}
      >
        {discreteSelector.items.map((item) => (
          <option
            key={item.sortNo}
            data-testid={item.text}
            {...discreteSelector.getSelectOptionProps(item)}
            style={getDefaultListItemStyle(discreteSelector, item)}
          >
            {discreteSelector.getItemLabel(item.text, item)}
          </option>
        ))}
      </select>
    </div>
  );
}

// eslint-disable-next-line import/no-default-export
export default {
  component: Example2,
  title: "HOOKS/Properties Selector",
} as Meta;

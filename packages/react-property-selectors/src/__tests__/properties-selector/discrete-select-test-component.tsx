import { PropertyFilter, PropertyValue, PropertyValueSet } from "@promaster-sdk/property";
import React, { Fragment, useState } from "react";
import { BaseUnits, UnitMap } from "uom";
import {
  DiscretePropertySelectorOptions,
  useDiscretePropertySelector,
} from "../../discrete/use-discrete-property-selector";
import { usePropertiesSelector, UsePropertiesSelectorOptions } from "../../properties-selector/use-properties-selector";

const unitLookup: UnitMap.UnitLookup = (unitString) => (BaseUnits as UnitMap.UnitMap)[unitString];

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

function getExampleProductProperties(): {
  readonly properties: ReadonlyArray<PropertyDef>;
} {
  return {
    properties: [
      {
        sortNo: 1,
        name: "select_a",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 10,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.Empty,
            text: "option_a_1",
          },
          {
            sortNo: 20,
            value: PropertyValue.fromInteger(2),
            validationFilter: PropertyFilter.fromString("select_b=2", unitLookup) || PropertyFilter.Empty,
            text: "option_a_2",
          },
        ],
      },
      {
        sortNo: 2,
        name: "select_b",
        group: "Group1",
        validationFilter: PropertyFilter.Empty,
        visibilityFilter: PropertyFilter.Empty,
        items: [
          {
            sortNo: 10,
            value: PropertyValue.fromInteger(1),
            validationFilter: PropertyFilter.Empty,
            text: "option_b_1",
          },
          {
            sortNo: 20,
            value: PropertyValue.fromInteger(2),
            validationFilter: PropertyFilter.Empty,
            text: "option_b_2",
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

export function DiscreteSelectTestComponent({
  autoSelectSingleValidValue,
  lockSingleValidValue,
}: {
  readonly autoSelectSingleValidValue?: boolean;
  readonly lockSingleValidValue?: boolean;
}): React.ReactElement<{}> {
  const [pvs, setPvs] = useState(PropertyValueSet.fromString("select_a=2;select_b=2;", unitLookup));

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
    autoSelectSingleValidValue,
    lockSingleValidValue,
  };

  const sel = usePropertiesSelector(selOptions);

  return (
    <>
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
          {sel.getGroupProperties(group).map((property) => {
            const selectorInfo = sel.getPropertySelectorHookInfo(property);
            return (
              <Fragment key={property.name}>
                {selectorInfo.type === "Discrete" && (
                  <CustomDropdown propertyName={property.name} options={selectorInfo.getUseDiscreteOptions()} />
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </>
  );
}

export function Select({
  options,
  propertyName,
}: {
  readonly options: DiscretePropertySelectorOptions<PropertyValueDef>;
  readonly propertyName: string;
}): JSX.Element {
  const discreteSelector = useDiscretePropertySelector(options);
  return (
    <select data-testid={propertyName} {...discreteSelector.getSelectProps()}>
      {discreteSelector.items.map((item) => (
        <option key={item.sortNo} data-testid={item.text} {...discreteSelector.getSelectOptionProps(item)}>
          {discreteSelector.getItemLabel(item.text, item)}
        </option>
      ))}
    </select>
  );
}

function CustomDropdown({
  options,
  propertyName,
}: {
  readonly options: DiscretePropertySelectorOptions<PropertyValueDef>;
  readonly propertyName: string;
}): JSX.Element {
  const discreteSelector = useDiscretePropertySelector(options);
  return (
    <>
      <button {...discreteSelector.getDropdownToggleButtonProps()} />
      {discreteSelector.isOpen && <div>{`content-${propertyName}`}</div>}
      <button
        data-testid={`button-${propertyName}`}
        onClick={() => discreteSelector.setIsOpen(!discreteSelector.isOpen)}
      >
        Toggle
      </button>
    </>
  );
}

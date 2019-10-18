import * as React from "react";
import {
  PropertyFilter,
  PropertyValue,
  PropertyValueSet
} from "@promaster-sdk/property";
import * as PropertyFiltering from "@promaster-sdk/property-filter-pretty";

export interface CheckboxPropertyValueItem {
  readonly value: PropertyValue.PropertyValue | undefined | null;
  readonly sortNo: number;
  readonly text: string;
  readonly image?: string;
  readonly validationFilter: PropertyFilter.PropertyFilter;
}

export interface CheckboxPropertySelectorProps {
  readonly propertyName: string;
  readonly propertyValueSet: PropertyValueSet.PropertyValueSet;
  readonly valueItems: ReadonlyArray<CheckboxPropertyValueItem>;
  readonly showCodes: boolean;
  readonly filterPrettyPrint: PropertyFiltering.FilterPrettyPrint;
  readonly onValueChange: (newValue: PropertyValue.PropertyValue) => void;
  readonly readOnly: boolean;
  readonly locked: boolean;
  readonly comparer?: PropertyValue.Comparer;
}

export type CheckboxProps = {
  readonly locked: boolean;
  readonly checked: boolean;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface CreateCheckboxPropertySelectorParams {
  readonly CheckboxContainer?: React.ComponentType<CheckboxProps>;
  readonly Checkbox?: React.ComponentType<CheckboxProps>;
}

export type CheckboxPropertySelector = React.StatelessComponent<
  CheckboxPropertySelectorProps
>;

const defaultCheckboxContainer = (props: CheckboxProps): JSX.Element => (
  <div
    {...props}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer"

      // img {
      //   max-width: 100px;
      //   max-height: 100px;
      // }
    }}
  />
);

const defaultCheckbox = (props: CheckboxProps): JSX.Element => (
  <div
    {...props}
    style={{
      marginTop: "5px",
      position: "relative",
      backgroundColor: "#ccc",
      width: "22px",
      height: "22px",
      background: props.checked ? "red" : "green"

      // &:after {
      //   display: ${(p: CheckboxProps) => (p.checked ? "initial" : "none")};
      //   position: absolute;
      //   top: 1px;
      //   left: 7px;
      //   content: '';
      //   border-right: 3px solid black;
      //   border-bottom: 3px solid black;
      //   width: 6px;
      //   height: 12px;
      //   transform: rotate(45deg);
      // }
    }}
  />
);

export function createCheckboxPropertySelector({
  CheckboxContainer = defaultCheckboxContainer,
  Checkbox = defaultCheckbox
}: CreateCheckboxPropertySelectorParams): CheckboxPropertySelector {
  return function CheckboxPropertySelector({
    propertyName,
    propertyValueSet,
    valueItems,
    showCodes,
    onValueChange,
    locked,
    comparer
  }: CheckboxPropertySelectorProps): React.ReactElement<
    CheckboxPropertySelectorProps
  > {
    const value = PropertyValueSet.getValue(propertyName, propertyValueSet);

    if (!valueItems || valueItems.length !== 2) {
      return <div />;
    }
    const falseValue = valueItems[0];
    const trueValue = valueItems[1];
    if (!falseValue.value || !trueValue.value) {
      return <div />;
    }

    const checked = PropertyValue.equals(trueValue.value, value, comparer);
    const nextValue = checked ? falseValue.value : trueValue.value;
    return (
      <CheckboxContainer
        locked={locked}
        checked={checked}
        onClick={() => onValueChange(nextValue)}
      >
        {trueValue.image && <img src={trueValue.image} />}
        <div>{_getItemLabel(trueValue, showCodes)}</div>
        <Checkbox locked={locked} checked={checked} />
      </CheckboxContainer>
    );
  };
}

function _getItemLabel(
  valueItem: CheckboxPropertyValueItem,
  showCodes: boolean
): string {
  if (valueItem.value === undefined || valueItem.value === null) {
    return "";
  }

  return (
    valueItem.text +
    (showCodes ? ` (${PropertyValue.toString(valueItem.value)}) ` : "")
  );
}

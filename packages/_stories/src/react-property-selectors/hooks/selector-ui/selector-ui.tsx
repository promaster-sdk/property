import React from "react";
import {
  DiscretePropertySelector,
  DiscretePropertySelectorOptions,
  getDefaultAmountInputBoxStyle,
  getDefaultCheckboxContainerStyle2,
  getDefaultCheckboxStyle2,
  getDefaultListItemStyle2,
  getDefaultMenuStyle2,
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
import { MyItem } from "./example-product-properties";

export type SelectorTypes = { readonly [propertyName: string]: string };

export function MyDiscreteSelector({
  selctorTypes,
  options,
}: {
  readonly selctorTypes: SelectorTypes;
  readonly options: DiscretePropertySelectorOptions<MyItem>;
}): JSX.Element {
  const sel = useDiscretePropertySelector(options);
  switch (selctorTypes[options.propertyName]) {
    case "RadioGroup":
      return <MyDiscreteRadioGroupSelector {...sel} />;
    case "Checkbox":
      return <MyDiscreteCheckboxSelector {...sel} />;
    default:
      if (sel.items.some((o) => o.image !== undefined)) {
        return <MyDiscreteImageComboboxSelector {...sel} />;
      }
      return <MyDiscreteComboboxSelector {...sel} />;
  }
}

export function MyDiscreteCheckboxSelector(sel: DiscretePropertySelector<MyItem>): JSX.Element {
  return (
    <div {...sel.getCheckboxDivProps()} style={getDefaultCheckboxContainerStyle2()}>
      {sel.selectedItem.image && <img src={sel.selectedItem.image} />}
      <div>{sel.getItemLabel(sel.selectedItem)}</div>
      <div style={getDefaultCheckboxStyle2(sel)} />
    </div>
  );
}

export function MyDiscreteRadioGroupSelector(sel: DiscretePropertySelector<MyItem>): JSX.Element {
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

export function MyDiscreteComboboxSelector(sel: DiscretePropertySelector<MyItem>): JSX.Element {
  return (
    <select {...sel.getSelectProps()} style={{ ...getDefaultSelectStyle2(sel) }}>
      {sel.items.map((o) => (
        <option {...sel.getOptionProps(o)} style={getDefaultOptionStyle2(sel, o)} />
      ))}
    </select>
  );
}

export function MyDiscreteImageComboboxSelector(sel: DiscretePropertySelector<MyItem>): JSX.Element {
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
        <ul id="DropdownOptionsElement" style={getDefaultMenuStyle2()}>
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

export function MyAmountSelector(props: UseAmountPropertySelectorOptions): JSX.Element {
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

export function MyTextboxSelector(props: UseTextboxPropertySelectorOptions): JSX.Element {
  const sel = useTextboxPropertySelector(props);
  return <input {...sel.getInputProps()} />;
}

import React from "react";
import {
  DiscretePropertySelector,
  DiscretePropertySelectorOptions,
  getDefaultAmountInputBoxStyle,
  getDefaultCheckboxContainerStyle,
  getDefaultCheckboxStyle,
  getDefaultListItemStyle,
  getDefaultMenuStyle,
  getDefaultOptionStyle,
  getDefaultRadioItemStyle,
  getDefaultSelectStyle,
  getDefaultToggleButtonStyle,
  useAmountPropertySelector,
  UseAmountPropertySelectorOptions,
  useDiscretePropertySelector,
  useTextboxPropertySelector,
  UseTextboxPropertySelectorOptions,
} from "../../index";
import { MyItem } from "./example-product-properties";

export type SelectorTypes = { readonly [propertyName: string]: string };

export function MyDiscreteSelector({
  selectorType,
  options,
}: {
  readonly selectorType: string | undefined;
  readonly options: DiscretePropertySelectorOptions<MyItem>;
}): JSX.Element {
  const sel = useDiscretePropertySelector(options);
  switch (selectorType) {
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
    <div {...sel.getCheckboxDivProps()} style={getDefaultCheckboxContainerStyle()}>
      {sel.selectedItem.image && <img src={sel.selectedItem.image} />}
      <div>{sel.getItemLabel(sel.selectedItem.text, sel.selectedItem)}</div>
      <div style={getDefaultCheckboxStyle(sel)} />
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
            key={item.sortNo}
            {...sel.getRadioItemProps(item)}
            title={sel.getItemToolTip(item)}
            style={getDefaultRadioItemStyle(sel, item)}
          >
            {item.image ? <img src={item.image} /> : undefined}
            {sel.getItemLabel(item.text, item)}
          </div>
        ))}
    </div>
  );
}

export function MyDiscreteComboboxSelector(sel: DiscretePropertySelector<MyItem>): JSX.Element {
  return (
    <select {...sel.getSelectProps()} style={{ ...getDefaultSelectStyle(sel) }}>
      {sel.items.map((item) => (
        <option key={item.sortNo} {...sel.getSelectOptionProps(item)} style={getDefaultOptionStyle(sel, item)}>
          {sel.getItemLabel(item.text, item)}
        </option>
      ))}
    </select>
  );
}

export function MyDiscreteImageComboboxSelector(sel: DiscretePropertySelector<MyItem>): JSX.Element {
  return (
    <div style={{ userSelect: "none" }}>
      <button {...sel.getDropdownToggleButtonProps()} style={getDefaultToggleButtonStyle(sel)}>
        <span>
          {sel.selectedItem.image && <img src={sel.selectedItem.image} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
          {" " + sel.getItemLabel(sel.selectedItem.text, sel.selectedItem) + " "}
        </span>
        <i className="fa fa-caret-down" />
      </button>
      {/* optionsList */}
      {sel.isOpen && (
        <ul id="DropdownOptionsElement" style={getDefaultMenuStyle()}>
          {sel.items.map((item) => (
            <li key={item.sortNo} {...sel.getDropdownListItemProps(item)} style={getDefaultListItemStyle(sel, item)}>
              <span>
                {item.image && <img src={item.image} style={{ maxWidth: "2em", maxHeight: "2em" }} />}
                {" " + sel.getItemLabel(item.text, item) + " "}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MyAmountSelector(props: UseAmountPropertySelectorOptions): JSX.Element {
  console.log("CHECK 1 props -> ", props);
  const sel = useAmountPropertySelector(props);

  return (
    <span>
      <input
        type="text"
        {...sel.amountInputBox.getInputProps()}
        style={getDefaultAmountInputBoxStyle(sel.amountInputBox)}
      />
      <span>
        {sel.amountFormatSelector.isOpen ? (
          <>
            <select {...sel.amountFormatSelector.getUnitSelectProps()}>
              {sel.amountFormatSelector.unitItems.map((item, index) => (
                <option key={index} {...sel.amountFormatSelector.getUnitItemProps(index)}>
                  {item.label}
                </option>
              ))}
            </select>
            <select {...sel.amountFormatSelector.getDecimalCountSelectProps()}>
              {sel.amountFormatSelector.decimalCountItems.map((item, index) => (
                <option key={index} {...sel.amountFormatSelector.getDecimalCountItemProps(index)}>
                  {item.label}
                </option>
              ))}
            </select>
            {sel.amountFormatSelector.showClearButton && (
              <button {...sel.amountFormatSelector.getCancelButtonProps()}>Cancel</button>
            )}
            <button {...sel.amountFormatSelector.getClearButtonProps()}>Clear</button>
          </>
        ) : (
          <label {...sel.amountFormatSelector.getLabelProps()}>{sel.amountFormatSelector.label}</label>
        )}
      </span>
    </span>
  );
}

export function MyTextboxSelector(props: UseTextboxPropertySelectorOptions): JSX.Element {
  const sel = useTextboxPropertySelector(props);
  return <input type="text" {...sel.getInputProps()} />;
}

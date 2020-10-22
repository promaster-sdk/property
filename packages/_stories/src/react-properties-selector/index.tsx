import React from "react";
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import { linkTo } from "@storybook/addon-links";
// import { Button, Welcome } from "@storybook/react/demo";
// import { setOptions } from '@storybook/addon-options';
import { AmountFormatSelectorExample1 } from "./amount-format-selector/example-1";
import { AmountPropertySelectorExample1 } from "./amount-property-selector/example-1";
import { ComboboxPropertySelectorExample1 } from "./combobox-property-selector/example-1";
import { CheckboxPropertySelectorExample1 } from "./checkbox-property-selector/example-1";
import { DropdownExample1 } from "./dropdown/example-1";
import { TextboxPropertySelectorExample1 } from "./textbox-property-selector/example-1";
import { RadioGroupPropertySelectorExample1 } from "./radiogroup-property-selector/example-1";
import { PropertiesSelectorExample1 } from "./properties-selector/example-1";
import { PropertiesSelectorExample2 } from "./properties-selector/example-2";
import { PropertiesSelectorExample3AutoSelectAndLockSingleValidValue } from "./properties-selector/example-3-auto-select-and-lock-single-valid-value";
import { PropertiesSelectorExample4LockSingleValidValue } from "./properties-selector/example-4-lock-single-valid-value";
import { PropertiesSelectorExampleEmptyPvs } from "./properties-selector/example-empty-pvs";

storiesOf("COMP: Properties Selector", module)
  .add("example 1", () => <PropertiesSelectorExample1 />)
  .add("example 2, with custom layout", () => <PropertiesSelectorExample2 />)
  .add("example 3, Auto select and lock with single valid value", () => (
    <PropertiesSelectorExample3AutoSelectAndLockSingleValidValue />
  ))
  .add("example 4, Lock with single valid value", () => <PropertiesSelectorExample4LockSingleValidValue />)
  .add("with empty property value set", () => <PropertiesSelectorExampleEmptyPvs />);

storiesOf("COMP: Amount Format Selector", module).add("example 1", () => <AmountFormatSelectorExample1 />);

storiesOf("COMP: Amount Property Selector", module).add("example 1", () => <AmountPropertySelectorExample1 />);

storiesOf("COMP: Combobox Property Selector", module).add("example 1", () => <ComboboxPropertySelectorExample1 />);

storiesOf("COMP: Radiogroup Property Selector", module).add("example 1", () => <RadioGroupPropertySelectorExample1 />);

storiesOf("COMP: Checkbox Property Selector", module).add("example 1", () => <CheckboxPropertySelectorExample1 />);

storiesOf("COMP: Dropdown", module).add("example 1", () => <DropdownExample1 />);

storiesOf("COMP: Textbox Property Selector", module).add("example 1", () => <TextboxPropertySelectorExample1 />);

import React from "react";
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import { linkTo } from "@storybook/addon-links";
// import { Button, Welcome } from "@storybook/react/demo";
import { AmountFormatSelectorExample1 } from "./amount-format-selector/example-1";
import { AmountPropertySelectorExample1 } from "./amount-property-selector/example-1";
import { ComboboxPropertySelectorExample1 } from "./combobox-property-selector/example-1";
import { CheckboxPropertySelectorExample1 } from "./checkbox-property-selector/example-1";
import { DropdownExample1 } from "./dropdown/example-1";
import { TextboxPropertySelectorExample1 } from "./textbox-property-selector/example-1";
import { ComboboxPropertySelectorExample1Hooks } from "./combobox-property-selector/example-1-hooks";
import { TextboxPropertySelectorExample1Hooks } from "./textbox-property-selector/example-1-hooks";
import { CheckboxPropertySelectorExample1Hooks } from "./checkbox-property-selector/example-1-hooks";
import { AmountFormatSelectorExample1Hooks } from "./amount-format-selector/example-1-hooks";
import { AmountPropertySelectorExample1Hooks } from "./amount-property-selector/example-1-hooks";

// storiesOf("Welcome", module).add("to Storybook", () => (
//   <Welcome showApp={linkTo("Button")} />
// ));

// storiesOf("Button", module)
//   .add("with text", () => (
//     <Button onClick={action("clicked")}>Hello Button</Button>
//   ))
//   .add("with some emoji", () => (
//     <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>
//   ));

storiesOf("Amount Format Selector", module)
  .add("example 1", () => <AmountFormatSelectorExample1 />)
  .add("example 1 hooks", () => <AmountFormatSelectorExample1Hooks />);

storiesOf("Amount Property Selector", module)
  .add("example 1", () => <AmountPropertySelectorExample1 />)
  .add("example 1 hooks", () => <AmountPropertySelectorExample1Hooks />);

storiesOf("Combobox Property Selector", module)
  .add("example 1", () => <ComboboxPropertySelectorExample1 />)
  .add("example 1 hooks", () => <ComboboxPropertySelectorExample1Hooks />);

storiesOf("Checkbox Property Selector", module)
  .add("example 1", () => <CheckboxPropertySelectorExample1 />)
  .add("example 1 hooks", () => <CheckboxPropertySelectorExample1Hooks />);

storiesOf("Dropdown", module).add("example 1", () => <DropdownExample1 />);

storiesOf("Textbox Property Selector", module)
  .add("example 1", () => <TextboxPropertySelectorExample1 />)
  .add("example 1 hooks", () => <TextboxPropertySelectorExample1Hooks />);

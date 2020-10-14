import React from "react";
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import { linkTo } from "@storybook/addon-links";
// import { Button, Welcome } from "@storybook/react/demo";
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

storiesOf("HOOKS: Amount Format Selector", module).add("example 1", () => (
  <AmountFormatSelectorExample1Hooks />
));

storiesOf("HOOKS: Amount Property Selector", module).add("example 1", () => (
  <AmountPropertySelectorExample1Hooks />
));

storiesOf("HOOKS: Combobox Property Selector", module).add("example 1", () => (
  <ComboboxPropertySelectorExample1Hooks />
));

storiesOf("HOOKS: Checkbox Property Selector", module).add("example 1", () => (
  <CheckboxPropertySelectorExample1Hooks />
));

storiesOf("HOOKS: Textbox Property Selector", module).add("example 1", () => (
  <TextboxPropertySelectorExample1Hooks />
));
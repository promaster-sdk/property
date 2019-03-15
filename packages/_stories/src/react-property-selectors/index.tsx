import * as React from "react";

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

storiesOf("Amount Format Selector", module).add("example 1", () => (
  <AmountFormatSelectorExample1 />
));

storiesOf("Amount Property Selector", module).add("example 1", () => (
  <AmountPropertySelectorExample1 />
));

storiesOf("Combobox Property Selector", module).add("example 1", () => (
  <ComboboxPropertySelectorExample1 />
));

storiesOf("Checkbox Property Selector", module).add("example 1", () => (
  <CheckboxPropertySelectorExample1 />
));

storiesOf("Dropdown", module).add("example 1", () => <DropdownExample1 />);

storiesOf("Textbox Property Selector", module).add("example 1", () => (
  <TextboxPropertySelectorExample1 />
));

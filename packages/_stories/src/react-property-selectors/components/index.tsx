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

// setOptions({
//   hierarchySeparator: /\/|\./, // matches a . or /
//   hierarchyRootSeparator: /\|/, //matches a |
// });

storiesOf("Addons|Links.Select", module).add("example 1", () => <AmountFormatSelectorExample1 />);

storiesOf("COMP: Amount Format Selector", module).add("example 1", () => <AmountFormatSelectorExample1 />);

storiesOf("COMP: Amount Property Selector", module).add("example 1", () => <AmountPropertySelectorExample1 />);

storiesOf("COMP: Combobox Property Selector", module).add("example 1", () => <ComboboxPropertySelectorExample1 />);

storiesOf("COMP: Checkbox Property Selector", module).add("example 1", () => <CheckboxPropertySelectorExample1 />);

storiesOf("COMP: Dropdown", module).add("example 1", () => <DropdownExample1 />);

storiesOf("COMP: Textbox Property Selector", module).add("example 1", () => <TextboxPropertySelectorExample1 />);

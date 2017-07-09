import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";

import { AmountFormatSelectorExample1 } from "./amount-format-selector/example-1";
import { AmountPropertySelectorExample1 } from "./amount-property-selector/example-1";
import { ComboboxPropertySelectorExample1 } from "./combobox-property-selector/example-1";
import { DropdownExample1 } from "./dropdown/example-1";
import { PropertiesSelectorExample1 } from "./properties-selector/example-1";
import { PropertiesSelectorExample2 } from "./properties-selector/example-2";
import { PropertiesSelectorExample3SingleValidValue } from "./properties-selector/example-3-single-valid-value";
import { PropertiesSelectorExampleEmptyPvs } from "./properties-selector/example-empty-pvs";

storiesOf("Welcome", module).add("to Storybook", () => <Welcome showApp={linkTo("Button")} />);

storiesOf("Button", module)
  .add("with text", () => <Button onClick={action("clicked")}>Hello Button</Button>)
  .add("with some emoji", () => <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>);

storiesOf("Amount Format Selector", module)
  .add("example 1", () => <AmountFormatSelectorExample1 />);

storiesOf("Amount Property Selector", module)
  .add("example 1", () => <AmountPropertySelectorExample1 />);

storiesOf("Combobox Property Selector", module)
  .add("example 1", () => <ComboboxPropertySelectorExample1 />);

storiesOf("Dropdown", module)
  .add("example 1", () => <DropdownExample1 />);

storiesOf("Properties Selector", module)
  .add("example 1", () => <PropertiesSelectorExample1 />)
  .add("example 2, with custom layout", () => <PropertiesSelectorExample2 />)
  .add("example 3, with single valid value", () => <PropertiesSelectorExample3SingleValidValue />)
  .add("with empty property value set", () => <PropertiesSelectorExampleEmptyPvs />);

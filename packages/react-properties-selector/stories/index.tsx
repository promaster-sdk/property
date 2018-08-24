import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";

import { PropertiesSelectorExample1 } from "./example-1";
import { PropertiesSelectorExample2 } from "./example-2";
import { PropertiesSelectorExample3AutoSelectAndLockSingleValidValue } from "./example-3-auto-select-and-lock-single-valid-value";
import { PropertiesSelectorExample4LockSingleValidValue } from "./example-4-lock-single-valid-value";
import { PropertiesSelectorExampleEmptyPvs } from "./example-empty-pvs";

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Button", module)
  .add("with text", () => (
    <Button onClick={action("clicked")}>Hello Button</Button>
  ))
  .add("with some emoji", () => (
    <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>
  ));

storiesOf("Properties Selector", module)
  .add("example 1", () => <PropertiesSelectorExample1 />)
  .add("example 2, with custom layout", () => <PropertiesSelectorExample2 />)
  .add("example 3, Auto select and lock with single valid value", () => (
    <PropertiesSelectorExample3AutoSelectAndLockSingleValidValue />
  ))
  .add("example 4, Lock with single valid value", () => (
    <PropertiesSelectorExample4LockSingleValidValue />
  ))
  .add("with empty property value set", () => (
    <PropertiesSelectorExampleEmptyPvs />
  ));

import * as React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";

import { AmountFormatSelectorExample1 } from "./amount-format-selector/example-1";

storiesOf("Welcome", module).add("to Storybook", () => <Welcome showApp={linkTo("Button")} />);

storiesOf("Button", module)
  .add("with text", () => <Button onClick={action("clicked")}>Hello Button</Button>)
  .add("with some emoji", () => <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>);

storiesOf("AmountFormatSelector", module)
  .add("example 1", () => <AmountFormatSelectorExample1 />)
  .add("example 2", () => <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>);

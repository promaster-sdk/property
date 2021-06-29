import React from "react";
import { Meta } from "@storybook/react";
import { Button } from "./button";

// eslint-disable-next-line import/no-default-export
export default {
  component: Button,
  title: "Components/Button",
} as Meta;

export const Primary: React.VFC<{}> = () => <Button>Button</Button>;

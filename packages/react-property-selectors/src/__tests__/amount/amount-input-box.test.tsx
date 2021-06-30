import React from "react";
import { Amount, Unit } from "uom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountInputBoxTestComponent } from "./amount-input-box-test-component";

describe("Test <AmountInputBoxTestComponent />", () => {
  it("should call onValueChange after typing a valid value", async () => {
    const onValueChange = jest.fn();
    render(<AmountInputBoxTestComponent onValueChange={onValueChange} />);
    const input = screen.getByTestId("input");
    userEvent.type(input, "1");
    expect(input).toHaveValue("101");
    const a = Amount.create(101, Unit.One);
    expect(onValueChange).not.toHaveBeenCalled(); // It won't be called immediately
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(a), { timeout: 100 }); // But will get called within 100ms
  });

  it("should not call onValueChange after typing a invalid value", async () => {
    const onValueChange = jest.fn();
    render(<AmountInputBoxTestComponent onValueChange={onValueChange} />);
    const input = screen.getByTestId("input");
    userEvent.type(input, "A");
    expect(input).toHaveValue("10A");
    await waitFor(() => expect(onValueChange).not.toHaveBeenCalled(), { timeout: 100 });
  });

  it("should not call onValueChange after changing an invalid value back to valid", async () => {
    const onValueChange = jest.fn();
    render(<AmountInputBoxTestComponent onValueChange={onValueChange} />);
    const input = screen.getByTestId("input");
    userEvent.type(input, "A{backspace}1");
    expect(input).toHaveValue("101");
    const a = Amount.create(101, Unit.One);
    expect(onValueChange).not.toHaveBeenCalled(); // It won't be called immediately
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(a), { timeout: 100 });
  });

  it("should work to make quick changes including invalid 'values'", async () => {
    const onValueChange = jest.fn();
    render(<AmountInputBoxTestComponent onValueChange={onValueChange} />);
    const input = screen.getByTestId("input");
    userEvent.clear(input);
    userEvent.type(input, "10");
    await userEvent.type(input, ".2", { delay: 2000 });
    expect(input).toHaveValue("10.2");
    expect(onValueChange).not.toHaveBeenCalled(); // It won't be called immediately
    const a = Amount.create(10.2, Unit.One);
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(a), { timeout: 100 });
  });
});

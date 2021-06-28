import React from "react";
import { Amount, Unit } from "uom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountInputBoxTestComponent } from "./amount-input-box-component";

describe("Test <AmountInputBoxTestComponent />", () => {
  it("should call change value after typing", async () => {
    const onValueChange = jest.fn();
    // jest.spyOn(hooks, "useProducts").mockImplementation(mockHook);
    render(<AmountInputBoxTestComponent onValueChange={onValueChange} />);
    const input = screen.getByTestId("input");
    userEvent.type(input, "1");
    expect(input).toHaveValue("101");
    const a = Amount.create(101, Unit.One);
    expect(onValueChange).not.toHaveBeenCalled(); // It won't be called immediately
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(a), { timeout: 100 }); // But will get called within 100ms
    jest.clearAllMocks();
  });
});

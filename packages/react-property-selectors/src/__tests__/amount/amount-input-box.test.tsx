import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AmountInputBoxTestComponent } from "./amount-input-box-component";

describe("Test <AmountInputBoxTestComponent />", () => {
  it("should call change value after typing", async () => {
    // const mockHook = jest.fn();
    // jest.spyOn(hooks, "useProducts").mockImplementation(mockHook);
    render(<AmountInputBoxTestComponent />);
    const input = screen.getByTestId("input");
    userEvent.type(input, "A");
    expect(input).toHaveValue("10A");
    // expect(mockHook).not.toHaveBeenCalledWith("A"); // It won't be called immediately
    // await waitFor(() => expect(mockHook).toHaveBeenCalledWith("A"), { timeout: 350 }); // But will get called within 350ms
    // jest.clearAllMocks();
  });
});

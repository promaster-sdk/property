import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiscreteSelectTestComponent } from "./discrete-select-test-component";

describe("Test <DiscreteSelectTestComponent />", () => {
  it("Select should pick the only valid option when autoSelectSingleValidValue: true and lockSingleValidValue: undefined.", async () => {
    render(<DiscreteSelectTestComponent autoSelectSingleValidValue={true} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeFalsy();
    expect(optionA1.selected).toBeTruthy();
    expect(optionA2.selected).toBeFalsy();
  });

  it("Select should pick the only valid option when autoSelectSingleValidValue: undefined and lockSingleValidValue: undefined.", async () => {
    render(<DiscreteSelectTestComponent />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeFalsy();
    expect(optionA1.selected).toBeTruthy();
    expect(optionA2.selected).toBeFalsy();
  });

  it("Select should not pick the only valid option when autoSelectSingleValidValue: false and lockSingleValidValue: undefined.", async () => {
    render(<DiscreteSelectTestComponent autoSelectSingleValidValue={false} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeFalsy();
    expect(optionA1.selected).toBeFalsy();
    expect(optionA2.selected).toBeTruthy();
  });

  it("Select should pick the only valid option and disable the select when autoSelectSingleValidValue: true and lockSingleValidValue: true.", async () => {
    render(<DiscreteSelectTestComponent autoSelectSingleValidValue={true} lockSingleValidValue={true} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeTruthy();
    expect(optionA1.selected).toBeTruthy();
    expect(optionA2.selected).toBeFalsy();
  });

  it("Select should pick the only valid option and disable the select when autoSelectSingleValidValue: undefined and lockSingleValidValue: true.", async () => {
    render(<DiscreteSelectTestComponent lockSingleValidValue={true} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeTruthy();
    expect(optionA1.selected).toBeTruthy();
    expect(optionA2.selected).toBeFalsy();
  });

  it("Select should not pick the only valid option and not disable the select when autoSelectSingleValidValue: false and lockSingleValidValue: true.", async () => {
    render(<DiscreteSelectTestComponent autoSelectSingleValidValue={false} lockSingleValidValue={true} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeFalsy();
    expect(optionA1.selected).toBeFalsy();
    expect(optionA2.selected).toBeTruthy();
  });

  it("Select should pick the only valid option and not disable the select when autoSelectSingleValidValue: true and lockSingleValidValue: false.", async () => {
    render(<DiscreteSelectTestComponent autoSelectSingleValidValue={true} lockSingleValidValue={false} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeFalsy();
    expect(optionA1.selected).toBeTruthy();
    expect(optionA2.selected).toBeFalsy();
  });

  it("Select should not pick the only valid option and not disable the select when autoSelectSingleValidValue: undefined and lockSingleValidValue: false.", async () => {
    render(<DiscreteSelectTestComponent autoSelectSingleValidValue={false} lockSingleValidValue={false} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeFalsy();
    expect(optionA1.selected).toBeFalsy();
    expect(optionA2.selected).toBeTruthy();
  });

  it("Select should not pick the only valid option and not disable the select when autoSelectSingleValidValue: false and lockSingleValidValue: false.", async () => {
    render(<DiscreteSelectTestComponent autoSelectSingleValidValue={false} lockSingleValidValue={false} />);
    const selectA = screen.getByTestId("select_a") as HTMLSelectElement;
    const selectB = screen.getByTestId("select_b") as HTMLSelectElement;
    const optionA1 = screen.getByTestId("option_a_1") as HTMLOptionElement;
    const optionA2 = screen.getByTestId("option_a_2") as HTMLOptionElement;
    fireEvent.change(selectB, { target: { value: 1 } });
    expect(selectA.disabled).toBeFalsy();
    expect(optionA1.selected).toBeFalsy();
    expect(optionA2.selected).toBeTruthy();
  });
});

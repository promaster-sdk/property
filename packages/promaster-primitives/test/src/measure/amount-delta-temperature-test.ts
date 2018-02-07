import * as Units from "../../../src/measure/units";
import * as Amount from "../../../src/measure/amount";
import { assert } from "chai";

describe("amount_delta_temperature_test", () => {
  it("ZeroCelsiusIsZeroFahrenheit", () => {
    const zeroCelsius = Amount.create(0.0, Units.DeltaCelsius);
    assert.equal(
      Math.abs(Amount.valueAs(Units.DeltaFahrenheit, zeroCelsius)) < 0.000001,
      true
    );
  });
});

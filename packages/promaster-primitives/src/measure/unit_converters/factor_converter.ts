import * as UnitConverter from "../unit_converter";

export interface FactorConverter {
	readonly type: "factor",
	readonly factor: number,
}

/// Inner class FactorConverter
export function createFactorConverter(factor: number): FactorConverter {
	if (factor === 1.0)
		throw new Error("Argument: factor " + factor.toString());
	return {type: "factor", factor};
}

export function convert(value: number, converter: FactorConverter): number {
	return value * converter.factor;
}

export function inverse(converter: FactorConverter): UnitConverter.UnitConverter {
	return createFactorConverter(1.0 / converter.factor);
}

import * as UnitConverter from "./unit_converter";

export interface FactorConverter {
	readonly type: "factor",
	readonly factor: number,
}

/// Inner class FactorConverter
export function create(factor: number): FactorConverter {

	if (factor === 1.0)
		throw new Error("Argument: factor " + factor.toString());

	return {type: "factor", factor};
}

export function convert(value: number, converter: FactorConverter): number {
	return value * converter.factor;
}

export function concatenate(concatConverter: UnitConverter.UnitConverter, converter: FactorConverter): UnitConverter.UnitConverter {

	if (concatConverter.type === "factor") {
		let f = converter.factor * concatConverter.factor;
		if (f == 1.0)
			return UnitConverter.Identity;
		return create(f);
	}

	return UnitConverter.concatenate(concatConverter, converter);
}

export function inverse(converter: FactorConverter): UnitConverter.UnitConverter {
	return create(1.0 / converter.factor);
}



import * as UnitConverter from "../unit_converter";

export interface OffsetConverter {
	readonly type: "offset",
	readonly offset: number,
}

/// Inner class OffsetConverter

const EPSILON: number = 4.94065645841247E-324;

export function create(offset: number): OffsetConverter {
	return {type: "offset", offset};
}

export function convert(value: number, converter: OffsetConverter): number {
	return value + converter.offset;
}

export function inverse(converter: OffsetConverter): UnitConverter.UnitConverter {
	return create(-converter.offset);
}


import {UnitConverter} from "../unit_converter";

export interface IdentityConverter {
	readonly type: "identity",
}

/// This inner class represents the identity converter (singleton).

export function create(): IdentityConverter {
	return {type: "identity"};
}

/// Implements abstract method.
export function concatenate(converter: UnitConverter): UnitConverter {
	return converter;
}

/// Implements abstract method.
export function convert(value: number): number {
	return value;
}

/// Implements abstract method.
export function inverse(converter: IdentityConverter): UnitConverter {
	return converter;
}


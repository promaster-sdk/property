import * as PropertyValue from "../product-properties/property-value";
import * as PropertyValueSet from "../product-properties/property-value-set";
import * as Ast from "./property-filter-ast";
import * as Parser from "./pegjs/property-filter-parser";

export interface PropertyFilter {
	text: string;
	ast: Ast.Expr;
}

//const _cache: Map<String, PropertyFilter> = new Map<String, PropertyFilter>();
const _cache: {[key:string]: PropertyFilter} = {};

export const Empty: PropertyFilter = {text: "", ast: Ast.newEmptyExpr()};

function create(text, ast): PropertyFilter {
	return {text, ast};
}

export function fromString(filter: string): PropertyFilter | undefined {
	if (filter === null || filter === undefined) {
		throw new Error("Argument 'filter' must be defined.");
	}

	if (!_cache.hasOwnProperty(filter)) {
		var adjustedFilter = _preProcessString(filter);
		if (adjustedFilter === "")
			return Empty;
		var ast = _buildAst(adjustedFilter, false);
		if (ast === undefined) {
			console.log("Invalid property filter syntax: " + adjustedFilter);
			return undefined;
		}
		_cache[filter] = create(adjustedFilter, ast);
	}
	return _cache[filter];
}

export function fromStringOrEmpty(filterString: string): PropertyFilter {
  const filter = fromString(filterString);
  if (filter === undefined) {
    return Empty;
  }
  return filter;
}

export function isSyntaxValid(filter: string, propertyNames: Array<string> | undefined = undefined): boolean {
	if (filter === null || filter === undefined) {
		throw new Error("Argument 'filter' must be defined.");
	}

	const adjusted = _preProcessString(filter);
	if (adjusted === "")
		return true;

	const ast = _buildAst(adjusted, false);
	if (ast === undefined) {
		return false;
	}

	if (propertyNames === undefined) {
		return true;
	}
	var parsed = create(filter, ast);

	const properties = getReferencedProperties(parsed);
	for (let p of Array.from(properties)) {
		if (propertyNames.indexOf(p) === -1)
			return false;
	}
	return true;
}

export function isValid(properties: PropertyValueSet.PropertyValueSet, filter: PropertyFilter): boolean {
	if (properties === null || properties === undefined) {
		throw new Error("Argument 'properties' must be defined.");
	}
	if (filter === null || filter === undefined) {
		throw new Error("Argument 'filter' must be defined.");
	}
	return _evaluate(filter.ast, properties, false);
}

export function isValidMatchMissing(properties: PropertyValueSet.PropertyValueSet, filter: PropertyFilter): boolean {
	if (properties === null || properties === undefined) {
		throw new Error("Argument 'properties' must be defined.");
	}
	if (filter === null || filter === undefined) {
		throw new Error("Argument 'filter' must be defined.");
	}
	return _evaluate(filter.ast, properties, true);
}

export function getReferencedProperties(filter: PropertyFilter): Set<string> {
	if (filter === null || filter === undefined) {
		throw new Error("Argument 'filter' must be defined.");
	}
	let properties = new Set<string>();
	_findProperties(filter.ast, properties);
	return properties;
}

export function toString(filter: PropertyFilter): string {
	if (filter === null || filter === undefined) {
		throw new Error("Argument 'filter' must be defined.");
	}
	return filter.text != null ? filter.text : "";
}

export function equals(other: PropertyFilter, filter: PropertyFilter) {
	if (filter === other) {
		return true;
	}
	if (filter === null || filter === undefined) {
		return false;
	}
	if (other === null || other === undefined) {
		return false;
	}
	return filter.text == filter.text;
}

function _preProcessString(filter: string): string {
	if (filter === "" || filter.trim().length === 0)
		return "";

	filter = filter.trim();
	let inString: boolean = false;
	var newFilter = "";
	for (let char of filter.split('')) {
		if (char == '"')
			inString = !inString;
		if (char != ' ' || inString)
			newFilter += char;
	}
	filter = newFilter.toString();

	return filter;
}

function _findProperties(e: any, properties: Set<string>): void {

	switch (e.type) {
		case "AndExpr":
			for (let child of e.children)
				_findProperties(child, properties);
			break;
		case "ComparisonExpr":
			_findProperties(e.leftValue, properties);
			_findProperties(e.rightValue, properties);
			break;
		case "EmptyExpr":
			// Do nothing
			break;
		case "EqualsExpr":
			_findProperties(e.leftValue, properties);
			for (let range of e.rightValueRanges)
				_findProperties(range, properties);
			break;
		case "IdentifierExpr": {
			properties.add(e.name);
			break;
		}
		case "OrExpr":
			for (let child of e.children)
				_findProperties(child, properties);
			break;
		case "ValueExpr":
			// Do nothing
			break;
		case "ValueRangeExpr":
			_findProperties(e.min, properties);
			_findProperties(e.max, properties);
			break;
		case "NullExpr":
			// Do nothing
			break;
	}
}

function _buildAst(text: string, throwOnInvalidSyntax: boolean): Ast.Expr | undefined {
	const result = Parser.parse(text, throwOnInvalidSyntax);
	return result;
}

export function _evaluate(e: Ast.Expr, properties: PropertyValueSet.PropertyValueSet, matchMissingIdentifiers: boolean): any {

	if (e.type === "AndExpr") {
		for (let child of e.children) {
			if (!_evaluate(child, properties, matchMissingIdentifiers))
				return false;
		}
		return true;
	}
	else if (e.type === "ComparisonExpr") {
		// Handle match missing identifier
		if (matchMissingIdentifiers && (_isMissingIdent(e.leftValue, properties)
			|| _isMissingIdent(e.rightValue, properties))) {
			return true;
		}

		let left: PropertyValue.PropertyValue = _evaluate(e.leftValue, properties, matchMissingIdentifiers);
		if (left == null)
			return false;

		let right: PropertyValue.PropertyValue = _evaluate(e.rightValue, properties, matchMissingIdentifiers);
		if (right == null)
			return false;

		switch (e.operationType) {
			case "less":
				return PropertyValue.lessThan(left, right);
			case "greater":
				return PropertyValue.greaterThan(left, right);
			case "lessOrEqual":
				return PropertyValue.lessOrEqualTo(left, right);
			case "greaterOrEqual":
				return PropertyValue.greaterOrEqualTo(left, right);
			default:
				throw new Error(`Unknown comparisontype: ${e.operationType}`);
		}
	}
	else if (e.type === "EmptyExpr") {
		return true;
	}
	else if (e.type === "EqualsExpr") {
		// Handle match missing identifier
		if (matchMissingIdentifiers) {
			if (_isMissingIdent(e.leftValue, properties) ||
				e.rightValueRanges.filter((vr: Ast.ValueRangeExpr) =>
					_isMissingIdent(vr.min, properties)
					|| _isMissingIdent(vr.max, properties)
				).length > 0) {
				return true;
			}
		}

		const left: PropertyValue.PropertyValue = _evaluate(e.leftValue, properties, matchMissingIdentifiers);

		for (let range of e.rightValueRanges) {
			let rangeResult = _evaluate(range, properties, matchMissingIdentifiers);
			let min: PropertyValue.PropertyValue = rangeResult[0];
			let max: PropertyValue.PropertyValue = rangeResult[1];

			// Match on NULL or inclusive in range
			if (((max === null || min === null) && left === null) ||
				(left !== null && min !== null && max !== null && (PropertyValue.greaterOrEqualTo(left, min) && PropertyValue.lessOrEqualTo(left, max)))) {
				return e.operationType == "equals";
			}
		}

		return e.operationType == "notEquals";
	}
	else if (e.type === "IdentifierExpr") {
		if (properties != null && PropertyValueSet.hasProperty(e.name, properties))
			return PropertyValueSet.get(e.name, properties);
		else
			return null;
	}
	else if (e.type === "OrExpr") {
		for (let child of e.children) {
			if (_evaluate(child, properties, matchMissingIdentifiers))
				return true;
		}
		return false;
	}
	else if (e.type === "ValueExpr") {
		return e.parsed;
	}
	else if (e.type === "ValueRangeExpr") {
		return [
			_evaluate(e.min, properties, matchMissingIdentifiers),
			_evaluate(e.max, properties, matchMissingIdentifiers)];
	}
	else if (e.type === "NullExpr") {
		return null;
	}
	else {
		throw new Error("invalid type.");
	}

}

function _isMissingIdent(e: Ast.Expr, properties: PropertyValueSet.PropertyValueSet): boolean {
	// If expression is an missing identifier it should match anything
	if (e.type === "IdentifierExpr") {
		if (!PropertyValueSet.hasProperty(e.name, properties))
			return true;
	}
	return false;
}


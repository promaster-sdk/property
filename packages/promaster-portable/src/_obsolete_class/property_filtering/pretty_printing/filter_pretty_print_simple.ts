import {
	PropertyFilter,
	Expr,
	ComparisonExpr,
	EmptyExpr,
	EqualsExpr,
	IdentifierExpr,
	OrExpr,
	ValueRangeExpr,
	ValueExpr,
	NullExpr,
	AndExpr,
	ComparisonOperationType,
	EqualsOperationType} from "promaster-primitives/lib/classes";

export const filterPrettyPrintSimple = (f:PropertyFilter):string => {
	if (f.ast == null)
		return "";
	var result = "";
	result = _print(f.ast, result);
	return result;
};

function _print(expr:Expr, s:string):string {

	if (expr instanceof AndExpr) {
		let e:AndExpr = expr;
		for (let child of e.children) {
			s = _print(child, s);
			if (child != e.children[e.children.length - 1])
				s += " and ";
		}
	}
	else if (expr instanceof ComparisonExpr) {
		let e:ComparisonExpr = expr;
		s = _print(e.leftValue, s);
		s += _comparisonOperationTypeToString(e.operationType);
		s = _print(e.rightValue, s);
	}
	else if (expr instanceof EmptyExpr) {
	}
	else if (expr instanceof EqualsExpr) {
		let e:EqualsExpr = expr;
		s = _print(e.leftValue, s);
		s += _equalsOperationTypeToString(e.operationType);
		for (let range of e.rightValueRanges) {
			s = _print(range, s);
			if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
				s += ",";
		}
	}
	else if (expr instanceof IdentifierExpr) {
		let e:IdentifierExpr = expr;
		s += e.name;
	}
	else if (expr instanceof OrExpr) {
		let e:OrExpr = expr;
		for (let child of e.children) {
			s = _print(child, s);
			if (child != e.children[e.children.length - 1])
				s += " or ";
		}
	}
	else if (expr instanceof ValueExpr) {
		let e:ValueExpr = expr;
		s += e.parsed.toString();
	}
	else if (expr instanceof ValueRangeExpr) {
		let e:ValueRangeExpr = expr;
		s = _print(e.min, s);
		if (e.min != e.max) {
			s += "-";
			s = _print(e.max, s);
		}
	}
	else if (expr instanceof NullExpr) {
		s += "null";
	}

	return s;

}

function _comparisonOperationTypeToString(type:ComparisonOperationType):string {
	switch (type) {
		case ComparisonOperationType.LessOrEqual:
			return " must be less than or equal to ";
		case ComparisonOperationType.GreaterOrEqual:
			return " must be greater than or equal to ";
		case ComparisonOperationType.Less:
			return " must be less than ";
		case ComparisonOperationType.Greater:
			return " must be greater than ";
		default:
			throw "Unknown ComparisonOperationType ";
	}
}

function _equalsOperationTypeToString(type:EqualsOperationType):string {
	switch (type) {
		case EqualsOperationType.Equals:
			return " must be ";
		case EqualsOperationType.NotEquals:
			return " must not be ";
		default:
			throw "Unknown EqualsOperationType ";
	}
}


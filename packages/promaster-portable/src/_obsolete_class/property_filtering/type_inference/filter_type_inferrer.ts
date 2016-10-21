import {
	PropertyFilter,
	PropertyType,
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
import {ExprType, ExprTypeEnum} from "./expr_type";

export function inferTypeMap(filter:PropertyFilter):Map<Expr, ExprType> {
	let typeMap = new Map<Expr, ExprType>();
	let lastPropertyType = new ExprType(ExprTypeEnum.Unknown);
	_visit(filter.ast, lastPropertyType, typeMap);
	return typeMap;
}

function _visit(expr:any, lastPropertyType:ExprType, typeMap:Map<Expr, ExprType>):void {

	if (expr instanceof AndExpr) {
		let e:AndExpr = expr;
		for (let child of e.children)
			_visit(child, lastPropertyType, typeMap);
		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (expr instanceof ComparisonExpr) {
		let e:ComparisonExpr = expr;
		lastPropertyType = new ExprType(ExprTypeEnum.Unknown);

		_visit(e.leftValue, lastPropertyType, typeMap);
		_visit(e.rightValue, lastPropertyType, typeMap);
		_visit(e.leftValue, lastPropertyType, typeMap);
		_visit(e.rightValue, lastPropertyType, typeMap);

		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (expr instanceof EmptyExpr) {
		typeMap.set(expr, new ExprType(ExprTypeEnum.Unknown));
	}
	else if (expr instanceof EqualsExpr) {
		let e:EqualsExpr = expr;
		lastPropertyType = new ExprType(ExprTypeEnum.Unknown);

		_visit(e.leftValue, lastPropertyType, typeMap);
		for (let range of e.rightValueRanges)
			_visit(range, lastPropertyType, typeMap);
		_visit(e.leftValue, lastPropertyType, typeMap);
		for (let range of e.rightValueRanges)
			_visit(range, lastPropertyType, typeMap);

		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (expr instanceof IdentifierExpr) {
		let e:IdentifierExpr = expr;
		typeMap.set(e, new ExprType(ExprTypeEnum.Property, e.name));
		lastPropertyType = typeMap.get(e);
	}
	else if (expr instanceof OrExpr) {
		let e:OrExpr = expr;
		for (let child of e.children)
			_visit(child, lastPropertyType, typeMap);
		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (expr instanceof ValueExpr) {
		let e:ValueExpr = expr;
		switch (e.parsed.type) {
			case PropertyType.Integer:
				typeMap.set(e, lastPropertyType);
				break;
			case PropertyType.Amount:
				typeMap.set(e, new ExprType(ExprTypeEnum.Amount));
				break;
			case PropertyType.Text:
				typeMap.set(e, new ExprType(ExprTypeEnum.Text));
				break;
		}
	}
	else if (expr instanceof ValueRangeExpr) {
		let e:ValueRangeExpr = expr;
		_visit(e.min, lastPropertyType, typeMap);
		_visit(e.max, lastPropertyType, typeMap);
		_visit(e.min, lastPropertyType, typeMap);
		_visit(e.max, lastPropertyType, typeMap);
		typeMap.set(e, new ExprType(ExprTypeEnum.Range));
	}
	else if (expr instanceof NullExpr) {
		typeMap.set(expr, lastPropertyType);
	}

}


import {PropertyFilterAst as Ast, PropertyFilter} from "promaster-primitives";
import {ExprType, ExprTypeEnum} from "./expr-type";

export function inferTypeMap(filter: PropertyFilter.PropertyFilter): Map<Ast.Expr, ExprType> {
	let typeMap = new Map<Ast.Expr, ExprType>();
	let lastPropertyType = new ExprType(ExprTypeEnum.Unknown);
	_visit(filter.ast, lastPropertyType, typeMap);
	return typeMap;
}

function _visit(e: Ast.Expr, lastPropertyType: ExprType, typeMap: Map<Ast.Expr, ExprType>): ExprType {

	if (e.type === "AndExpr") {
		for (let child of e.children)
			lastPropertyType = _visit(child, lastPropertyType, typeMap);
		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (e.type === "ComparisonExpr") {
		lastPropertyType = new ExprType(ExprTypeEnum.Unknown);

    lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
    lastPropertyType = _visit(e.rightValue, lastPropertyType, typeMap);
    lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
    lastPropertyType = _visit(e.rightValue, lastPropertyType, typeMap);

		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (e.type === "EmptyExpr") {
		typeMap.set(e, new ExprType(ExprTypeEnum.Unknown));
	}
	else if (e.type === "EqualsExpr") {
		lastPropertyType = new ExprType(ExprTypeEnum.Unknown);

    lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
		for (let range of e.rightValueRanges)
      lastPropertyType = _visit(range, lastPropertyType, typeMap);
    lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
		for (let range of e.rightValueRanges)
      lastPropertyType = _visit(range, lastPropertyType, typeMap);

		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (e.type === "IdentifierExpr") {
		typeMap.set(e, new ExprType(ExprTypeEnum.Property, e.name));
		lastPropertyType = typeMap.get(e) || lastPropertyType;
	}
	else if (e.type === "OrExpr") {
		for (let child of e.children)
      lastPropertyType = _visit(child, lastPropertyType, typeMap);
		typeMap.set(e, new ExprType(ExprTypeEnum.Bool));
	}
	else if (e.type === "ValueExpr") {
		switch (e.parsed.type) {
			case "integer":
				typeMap.set(e, lastPropertyType);
				break;
			case "amount":
				typeMap.set(e, new ExprType(ExprTypeEnum.Amount));
				break;
			case "text":
				typeMap.set(e, new ExprType(ExprTypeEnum.Text));
				break;
		}
	}
	else if (e.type === "ValueRangeExpr") {
    lastPropertyType = _visit(e.min, lastPropertyType, typeMap);
    lastPropertyType = _visit(e.max, lastPropertyType, typeMap);
    lastPropertyType = _visit(e.min, lastPropertyType, typeMap);
    lastPropertyType = _visit(e.max, lastPropertyType, typeMap);
		typeMap.set(e, new ExprType(ExprTypeEnum.Range));
	}
	else if (e.type === "NullExpr") {
		typeMap.set(e, lastPropertyType);
	}
  return lastPropertyType;
}


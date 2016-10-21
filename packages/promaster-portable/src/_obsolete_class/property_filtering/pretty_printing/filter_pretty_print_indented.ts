import {
	Expr,
	PropertyFilter,
	AndExpr,
	ComparisonExpr,
	EmptyExpr,
	EqualsExpr,
	IdentifierExpr,
	PropertyType,
	OrExpr,
	ValueExpr,
	ValueRangeExpr,
	NullExpr,
	Units
} from "promaster-primitives/lib/classes";
import {inferTypeMap} from "../type_inference/filter_type_inferrer";
import {ExprType,ExprTypeEnum} from "../type_inference/expr_type";
import {FilterPrettyPrintMessages} from "./filter_pretty_print_messages";
import {FilterPrettyPrint} from "../index";


export const filterPrettyPrintIndented = (messages:FilterPrettyPrintMessages,
																					indentationDepth:number, indentionString:string):FilterPrettyPrint =>
	(f:PropertyFilter):string => {
		let e = f.ast;
		if (e == null)
			return "";

		let typeMap = inferTypeMap(f);

		let stack = [];
		visit(e, indentationDepth, indentionString, messages, stack, typeMap);
		let buf = "";
		for (let s of _reversed(stack)) {
			buf += s;
		}
		return buf;
	};

function visit(expr:Expr, indentationDepth:number,
							 indentionString:string,
							 messages:FilterPrettyPrintMessages,
							 stack:Array<string>, typeMap:Map<Expr, ExprType>):void {

	const innerVisit = (expr:Expr) => visit(expr, indentationDepth, indentionString, messages, stack, typeMap);

	if (expr instanceof AndExpr) {
		let e:AndExpr = expr;
		for (let child of e.children) {
			indentationDepth++;
			innerVisit(child);
			indentationDepth--;

			if (child !== e.children[e.children.length - 1])
				stack.push("\n" + _generateIndention(indentationDepth, indentionString) + messages.andMessage() + "\n");
		}
	}
	else if (expr instanceof ComparisonExpr) {
		let e:ComparisonExpr = expr;
		stack.push(_generateIndention(indentationDepth, indentionString));
		innerVisit(e.leftValue);
		let left = stack.pop();
		innerVisit(e.rightValue);
		let right = stack.pop();
		stack.push(messages.comparisionOperationMessage(e.operationType, left, right));
	}
	else if (expr instanceof EmptyExpr) {
		// Do nothing
	}
	else if (expr instanceof EqualsExpr) {
		let e:EqualsExpr = expr;
		stack.push(_generateIndention(indentationDepth, indentionString));
		innerVisit(e.leftValue);
		let left = stack.pop();
		let builder:Array<string> = [];
		for (let range of e.rightValueRanges) {
			innerVisit(range);
			builder.push(stack.pop());
			if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
				builder.push(messages.orMessage());
		}

		let buf = "";
		let reversed = _reversed(builder);
		for (let i = 0; i < reversed.length; i++) {
			let x = reversed[i];
			buf += x;
			if (i < reversed.length - 1)
				buf += " ";
		}
		let joined = buf;
		stack.push(messages.equalsOperationMessage(e.operationType, left, joined));
	}
	else if (expr instanceof IdentifierExpr) {
		let e:IdentifierExpr = expr;
		stack.push(messages.propertyNameMessage(e.name));
	}
	else if (expr instanceof OrExpr) {
		let e:OrExpr = expr;
		for (let child of e.children) {
			indentationDepth++;
			innerVisit(child);
			indentationDepth--;

			if (child != e.children[e.children.length - 1])
				stack.push("\n" + _generateIndention(indentationDepth, indentionString) + messages.orMessage() + "\n");
		}
	}
	else if (expr instanceof ValueExpr) {
		let e:ValueExpr = expr;
		if (typeMap.get(e).exprTypeEnum == ExprTypeEnum.Property && typeMap.get(e).propertyName != null) {
			stack.push(messages.propertyValueItemMessage(typeMap.get(e).propertyName, e.parsed));
		}
		else if (e.parsed.type == PropertyType.Integer) {
			let cultureFormatted = e.parsed.getInteger().toString();
			stack.push(cultureFormatted);
		}
		else if (e.parsed.type == PropertyType.Amount) {
			let split = e.unParsed.split(':');
			if (split.length == 2)
				stack.push(split[0] + " " + Units.getUnitFromString(split[1]).label);
			else
				stack.push(split[0]);
		}
		else if (e.parsed.type == PropertyType.Text)
			stack.push(e.parsed.getText());
	}
	else if (expr instanceof ValueRangeExpr) {
		let e:ValueRangeExpr = expr;
		innerVisit(e.min);
		let min = stack.pop();
		innerVisit(e.max);
		let max = stack.pop();
		stack.push(min == max ? min : messages.rangeMessage(min, max));
	}
	else if (expr instanceof NullExpr) {
		stack.push(messages.nullMessage());
	}
	else {
		throw new Error("invalid type.");
	}

}

// Returns a reversed copy
function _reversed(array:Array<any>):Array<any> {
	return array.slice().reverse();
}


function _generateIndention(indentationDepth:number, indentionString:string):string {
	let b = "";
	for (let i = 0; i < indentationDepth; i++) {
		b += indentionString;
	}
	return b;
}

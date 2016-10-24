import {PropertyFilter, PropertyFilterAst as Ast, PropertyValue, Units, Unit} from "promaster-sdk/promaster-primitives";
import {inferTypeMap} from "../type_inference/filter_type_inferrer";
import {ExprType, ExprTypeEnum} from "../type_inference/expr_type";
import {FilterPrettyPrintMessages} from "./filter_pretty_print_messages";

export function filterPrettyPrintIndented(messages: FilterPrettyPrintMessages,
                                   indentationDepth: number,
                                   indentionString: string, f: PropertyFilter.PropertyFilter): string {
    const e = f.ast;
    if (e == null)
        return "";

    const typeMap = inferTypeMap(f);

    const stack = [];
    visit(e, indentationDepth, indentionString, messages, stack, typeMap);
    let buf = "";
    for (let s of _reversed(stack)) {
        buf += s;
    }
    return buf;
}

function visit(e: Ast.Expr, indentationDepth: number,
               indentionString: string,
               messages: FilterPrettyPrintMessages,
               stack: Array<string>, typeMap: Map<Ast.Expr, ExprType>): void {

    const innerVisit = (expr: Ast.Expr) => visit(expr, indentationDepth, indentionString, messages, stack, typeMap);

    if (e.type === "AndExpr") {
        for (let child of e.children) {
            indentationDepth++;
            innerVisit(child);
            indentationDepth--;

            if (child !== e.children[e.children.length - 1])
                stack.push("\n" + _generateIndention(indentationDepth, indentionString) + messages.andMessage() + "\n");
        }
    }
    else if (e.type === "ComparisonExpr") {
        stack.push(_generateIndention(indentationDepth, indentionString));
        innerVisit(e.leftValue);
        const left = stack.pop();
        innerVisit(e.rightValue);
        const right = stack.pop();
        stack.push(messages.comparisionOperationMessage(e.operationType, left, right));
    }
    else if (e.type === "EmptyExpr") {
        // Do nothing
    }
    else if (e.type === "EqualsExpr") {
        stack.push(_generateIndention(indentationDepth, indentionString));
        innerVisit(e.leftValue);
        const left = stack.pop();
        const builder: Array<string> = [];
        for (let range of e.rightValueRanges) {
            innerVisit(range);
            builder.push(stack.pop());
            if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
                builder.push(messages.orMessage());
        }

        let buf = "";
        const reversed = _reversed(builder);
        for (let i = 0; i < reversed.length; i++) {
            let x = reversed[i];
            buf += x;
            if (i < reversed.length - 1)
                buf += " ";
        }
        let joined = buf;
        stack.push(messages.equalsOperationMessage(e.operationType, left, joined));
    }
    else if (e.type === "IdentifierExpr") {
        stack.push(messages.propertyNameMessage(e.name));
    }
    else if (e.type === "OrExpr") {
        for (let child of e.children) {
            indentationDepth++;
            innerVisit(child);
            indentationDepth--;

            if (child != e.children[e.children.length - 1])
                stack.push("\n" + _generateIndention(indentationDepth, indentionString) + messages.orMessage() + "\n");
        }
    }
    else if (e.type === "ValueExpr") {
        if (typeMap.get(e).exprTypeEnum == ExprTypeEnum.Property && typeMap.get(e).propertyName != null) {
            stack.push(messages.propertyValueItemMessage(typeMap.get(e).propertyName, e.parsed));
        }
        else if (e.parsed.type == "integer") {
            const cultureFormatted = PropertyValue.getInteger(e.parsed).toString();
            stack.push(cultureFormatted);
        }
        else if (e.parsed.type == "amount") {
            const split = e.unParsed.split(':');
            if (split.length == 2)
                stack.push(split[0] + " " + Unit.getLabel(Units.getUnitFromString(split[1])));
            else
                stack.push(split[0]);
        }
        else if (e.parsed.type == "text")
            stack.push(PropertyValue.getText(e.parsed));
    }
    else if (e.type === "ValueRangeExpr") {
        innerVisit(e.min);
        const min = stack.pop();
        innerVisit(e.max);
        const max = stack.pop();
        stack.push(min == max ? min : messages.rangeMessage(min, max));
    }
    else if (e.type === "NullExpr") {
        stack.push(messages.nullMessage());
    }
    else {
        throw new Error("invalid type.");
    }

}

// Returns a reversed copy
function _reversed(array: Array<any>): Array<any> {
    return array.slice().reverse();
}


function _generateIndention(indentationDepth: number, indentionString: string): string {
    let b = "";
    for (let i = 0; i < indentationDepth; i++) {
        b += indentionString;
    }
    return b;
}

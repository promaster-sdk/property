"use strict";
var promaster_primitives_1 = require("promaster-sdk/promaster-primitives");
var filter_type_inferrer_1 = require("../type_inference/filter_type_inferrer");
var expr_type_1 = require("../type_inference/expr_type");
function filterPrettyPrintIndented(messages, indentationDepth, indentionString, f) {
    var e = f.ast;
    if (e == null)
        return "";
    var typeMap = filter_type_inferrer_1.inferTypeMap(f);
    var stack = [];
    visit(e, indentationDepth, indentionString, messages, stack, typeMap);
    var buf = "";
    for (var _i = 0, _a = _reversed(stack); _i < _a.length; _i++) {
        var s = _a[_i];
        buf += s;
    }
    return buf;
}
exports.filterPrettyPrintIndented = filterPrettyPrintIndented;
function visit(e, indentationDepth, indentionString, messages, stack, typeMap) {
    var innerVisit = function (expr) { return visit(expr, indentationDepth, indentionString, messages, stack, typeMap); };
    if (e.type === "AndExpr") {
        for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
            var child = _a[_i];
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
        var left = stack.pop();
        innerVisit(e.rightValue);
        var right = stack.pop();
        stack.push(messages.comparisionOperationMessage(e.operationType, left, right));
    }
    else if (e.type === "EmptyExpr") {
    }
    else if (e.type === "EqualsExpr") {
        stack.push(_generateIndention(indentationDepth, indentionString));
        innerVisit(e.leftValue);
        var left = stack.pop();
        var builder = [];
        for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
            var range = _c[_b];
            innerVisit(range);
            builder.push(stack.pop());
            if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
                builder.push(messages.orMessage());
        }
        var buf = "";
        var reversed = _reversed(builder);
        for (var i = 0; i < reversed.length; i++) {
            var x = reversed[i];
            buf += x;
            if (i < reversed.length - 1)
                buf += " ";
        }
        var joined = buf;
        stack.push(messages.equalsOperationMessage(e.operationType, left, joined));
    }
    else if (e.type === "IdentifierExpr") {
        stack.push(messages.propertyNameMessage(e.name));
    }
    else if (e.type === "OrExpr") {
        for (var _d = 0, _e = e.children; _d < _e.length; _d++) {
            var child = _e[_d];
            indentationDepth++;
            innerVisit(child);
            indentationDepth--;
            if (child != e.children[e.children.length - 1])
                stack.push("\n" + _generateIndention(indentationDepth, indentionString) + messages.orMessage() + "\n");
        }
    }
    else if (e.type === "ValueExpr") {
        if (typeMap.get(e).exprTypeEnum == expr_type_1.ExprTypeEnum.Property && typeMap.get(e).propertyName != null) {
            stack.push(messages.propertyValueItemMessage(typeMap.get(e).propertyName, e.parsed));
        }
        else if (e.parsed.type == "integer") {
            var cultureFormatted = promaster_primitives_1.PropertyValue.getInteger(e.parsed).toString();
            stack.push(cultureFormatted);
        }
        else if (e.parsed.type == "amount") {
            var split = e.unParsed.split(':');
            if (split.length == 2)
                stack.push(split[0] + " " + promaster_primitives_1.Unit.getLabel(promaster_primitives_1.Units.getUnitFromString(split[1])));
            else
                stack.push(split[0]);
        }
        else if (e.parsed.type == "text")
            stack.push(promaster_primitives_1.PropertyValue.getText(e.parsed));
    }
    else if (e.type === "ValueRangeExpr") {
        innerVisit(e.min);
        var min = stack.pop();
        innerVisit(e.max);
        var max = stack.pop();
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
function _reversed(array) {
    return array.slice().reverse();
}
function _generateIndention(indentationDepth, indentionString) {
    var b = "";
    for (var i = 0; i < indentationDepth; i++) {
        b += indentionString;
    }
    return b;
}
//# sourceMappingURL=filter_pretty_print_indented.js.map
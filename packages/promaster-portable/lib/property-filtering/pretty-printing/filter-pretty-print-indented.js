"use strict";
var promaster_primitives_1 = require("@promaster/promaster-primitives");
var filter_type_inferrer_1 = require("../type-inference/filter-type-inferrer");
var expr_type_1 = require("../type-inference/expr-type");
function filterPrettyPrintIndented(messages, indentationDepth, indentionString, f) {
    var e = f.ast;
    if (e == null)
        return "";
    var typeMap = filter_type_inferrer_1.inferTypeMap(f);
    return visit(e, indentationDepth, indentionString, messages, typeMap);
}
exports.filterPrettyPrintIndented = filterPrettyPrintIndented;
function visit(e, indentationDepth, indentionString, messages, typeMap) {
    var innerVisit = function (indent, expr) { return visit(expr, indent, indentionString, messages, typeMap); };
    if (e.type === "AndExpr") {
        var s = "";
        for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
            var child = _a[_i];
            s += innerVisit(indentationDepth, child);
            if (child !== e.children[e.children.length - 1]) {
                s += "\n" + _generateIndention(indentationDepth + 1, indentionString) + messages.andMessage() + "\n";
            }
        }
        return s;
    }
    else if (e.type === "ComparisonExpr") {
        var left = innerVisit(indentationDepth, e.leftValue);
        var right = innerVisit(indentationDepth, e.rightValue);
        return _generateIndention(indentationDepth, indentionString) + messages.comparisionOperationMessage(e.operationType, left, right);
    }
    else if (e.type === "EmptyExpr") {
        return "";
    }
    else if (e.type === "EqualsExpr") {
        var left = innerVisit(indentationDepth, e.leftValue);
        var builder = [];
        for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
            var range = _c[_b];
            var rangeMessage = innerVisit(indentationDepth, range);
            builder.push(rangeMessage);
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
        return _generateIndention(indentationDepth, indentionString) + messages.equalsOperationMessage(e.operationType, left, joined);
    }
    else if (e.type === "IdentifierExpr") {
        return messages.propertyNameMessage(e.name);
    }
    else if (e.type === "OrExpr") {
        var s = "";
        for (var _d = 0, _e = e.children; _d < _e.length; _d++) {
            var child = _e[_d];
            s += innerVisit(indentationDepth + 1, child);
            if (child != e.children[e.children.length - 1]) {
                s += "\n" + _generateIndention(indentationDepth, indentionString) + messages.orMessage() + "\n";
            }
        }
        return s;
    }
    else if (e.type === "ValueExpr") {
        var type = typeMap.get(e);
        if (type && type.exprTypeEnum == expr_type_1.ExprTypeEnum.Property && type.propertyName != null) {
            return messages.propertyValueItemMessage(type.propertyName, e.parsed);
        }
        else if (e.parsed.type === "integer") {
            var integer = promaster_primitives_1.PropertyValue.getInteger(e.parsed);
            var cultureFormatted = integer ? integer.toString() : "";
            return cultureFormatted;
        }
        else if (e.parsed.type == "amount") {
            var split = e.unParsed.split(':');
            if (split.length == 2)
                return split[0] + " " + promaster_primitives_1.UnitName.getName(promaster_primitives_1.Units.getUnitFromString(split[1]));
            else
                return split[0];
        }
        else if (e.parsed.type == "text")
            return promaster_primitives_1.PropertyValue.getText(e.parsed) || "";
    }
    else if (e.type === "ValueRangeExpr") {
        var min = innerVisit(indentationDepth, e.min);
        var max = innerVisit(indentationDepth, e.max);
        return min === max ? min : messages.rangeMessage(min, max);
    }
    else if (e.type === "NullExpr") {
        return messages.nullMessage();
    }
    else {
        throw new Error("invalid type.");
    }
    return "";
}
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
//# sourceMappingURL=filter-pretty-print-indented.js.map
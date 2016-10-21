"use strict";
function filterPrettyPrintSimple(f) {
    if (f.ast == null)
        return "";
    var result = "";
    result = _print(f.ast, result);
    return result;
}
exports.filterPrettyPrintSimple = filterPrettyPrintSimple;
function _print(e, s) {
    if (e.type === "AndExpr") {
        for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
            var child = _a[_i];
            s = _print(child, s);
            if (child != e.children[e.children.length - 1])
                s += " and ";
        }
    }
    else if (e.type === "ComparisonExpr") {
        s = _print(e.leftValue, s);
        s += _comparisonOperationTypeToString(e.operationType);
        s = _print(e.rightValue, s);
    }
    else if (e.type === "EmptyExpr") {
    }
    else if (e.type === "EqualsExpr") {
        s = _print(e.leftValue, s);
        s += _equalsOperationTypeToString(e.operationType);
        for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
            var range = _c[_b];
            s = _print(range, s);
            if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
                s += ",";
        }
    }
    else if (e.type === "IdentifierExpr") {
        s += e.name;
    }
    else if (e.type === "OrExpr") {
        for (var _d = 0, _e = e.children; _d < _e.length; _d++) {
            var child = _e[_d];
            s = _print(child, s);
            if (child != e.children[e.children.length - 1])
                s += " or ";
        }
    }
    else if (e.type === "ValueExpr") {
        s += e.parsed.toString();
    }
    else if (e.type === "ValueRangeExpr") {
        s = _print(e.min, s);
        if (e.min != e.max) {
            s += "-";
            s = _print(e.max, s);
        }
    }
    else if (e.type === "NullExpr") {
        s += "null";
    }
    return s;
}
function _comparisonOperationTypeToString(type) {
    switch (type) {
        case "lessOrEqual":
            return " must be less than or equal to ";
        case "greaterOrEqual":
            return " must be greater than or equal to ";
        case "less":
            return " must be less than ";
        case "greater":
            return " must be greater than ";
        default:
            throw "Unknown ComparisonOperationType ";
    }
}
function _equalsOperationTypeToString(type) {
    switch (type) {
        case "equals":
            return " must be ";
        case "notEquals":
            return " must not be ";
        default:
            throw "Unknown EqualsOperationType ";
    }
}
//# sourceMappingURL=filter_pretty_print_simple.js.map
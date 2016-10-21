"use strict";
var classes_1 = require("promaster-primitives/lib/classes");
exports.filterPrettyPrintSimple = function (f) {
    if (f.ast == null)
        return "";
    var result = "";
    result = _print(f.ast, result);
    return result;
};
function _print(expr, s) {
    if (expr instanceof classes_1.AndExpr) {
        var e = expr;
        for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
            var child = _a[_i];
            s = _print(child, s);
            if (child != e.children[e.children.length - 1])
                s += " and ";
        }
    }
    else if (expr instanceof classes_1.ComparisonExpr) {
        var e = expr;
        s = _print(e.leftValue, s);
        s += _comparisonOperationTypeToString(e.operationType);
        s = _print(e.rightValue, s);
    }
    else if (expr instanceof classes_1.EmptyExpr) {
    }
    else if (expr instanceof classes_1.EqualsExpr) {
        var e = expr;
        s = _print(e.leftValue, s);
        s += _equalsOperationTypeToString(e.operationType);
        for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
            var range = _c[_b];
            s = _print(range, s);
            if (range != e.rightValueRanges[e.rightValueRanges.length - 1])
                s += ",";
        }
    }
    else if (expr instanceof classes_1.IdentifierExpr) {
        var e = expr;
        s += e.name;
    }
    else if (expr instanceof classes_1.OrExpr) {
        var e = expr;
        for (var _d = 0, _e = e.children; _d < _e.length; _d++) {
            var child = _e[_d];
            s = _print(child, s);
            if (child != e.children[e.children.length - 1])
                s += " or ";
        }
    }
    else if (expr instanceof classes_1.ValueExpr) {
        var e = expr;
        s += e.parsed.toString();
    }
    else if (expr instanceof classes_1.ValueRangeExpr) {
        var e = expr;
        s = _print(e.min, s);
        if (e.min != e.max) {
            s += "-";
            s = _print(e.max, s);
        }
    }
    else if (expr instanceof classes_1.NullExpr) {
        s += "null";
    }
    return s;
}
function _comparisonOperationTypeToString(type) {
    switch (type) {
        case classes_1.ComparisonOperationType.LessOrEqual:
            return " must be less than or equal to ";
        case classes_1.ComparisonOperationType.GreaterOrEqual:
            return " must be greater than or equal to ";
        case classes_1.ComparisonOperationType.Less:
            return " must be less than ";
        case classes_1.ComparisonOperationType.Greater:
            return " must be greater than ";
        default:
            throw "Unknown ComparisonOperationType ";
    }
}
function _equalsOperationTypeToString(type) {
    switch (type) {
        case classes_1.EqualsOperationType.Equals:
            return " must be ";
        case classes_1.EqualsOperationType.NotEquals:
            return " must not be ";
        default:
            throw "Unknown EqualsOperationType ";
    }
}
//# sourceMappingURL=filter_pretty_print_simple.js.map
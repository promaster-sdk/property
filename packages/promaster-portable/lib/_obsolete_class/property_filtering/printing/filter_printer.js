"use strict";
var classes_1 = require("promaster-primitives/lib/classes");
var FilterPrinter = (function () {
    function FilterPrinter() {
    }
    FilterPrinter.prototype.print = function (expr) {
        var builder = "";
        if (expr == null)
            return "";
        this._print(expr, builder);
        return builder.toString();
    };
    FilterPrinter.prototype._print = function (expr, s) {
        if (expr instanceof classes_1.AndExpr) {
            var e = expr;
            for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this._print(child, s);
                if (child != e.children[e.children.length - 1])
                    s += "&";
            }
        }
        else if (expr instanceof classes_1.ComparisonExpr) {
            var e = expr;
            this._print(e.leftValue, s);
            s += FilterPrinter._comparisonOperationTypeToString(e.operationType);
            this._print(e.rightValue, s);
        }
        else if (expr instanceof classes_1.EmptyExpr) {
        }
        else if (expr instanceof classes_1.EqualsExpr) {
            var e = expr;
            this._print(e.leftValue, s);
            s += FilterPrinter._equalsOperationTypeToString(e.operationType);
            for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
                var range = _c[_b];
                this._print(range, s);
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
                this._print(child, s);
                if (child != e.children[e.children.length - 1])
                    s += "|";
            }
        }
        else if (expr instanceof classes_1.ValueExpr) {
            var e = expr;
            s += e.parsed.toString();
        }
        else if (expr instanceof classes_1.ValueRangeExpr) {
            var e = expr;
            this._print(e.min, s);
            if (e.min != e.max) {
                s += "~";
                this._print(e.max, s);
            }
        }
        else if (expr instanceof classes_1.NullExpr) {
            s += "null";
        }
    };
    FilterPrinter._comparisonOperationTypeToString = function (type) {
        switch (type) {
            case classes_1.ComparisonOperationType.LessOrEqual:
                return "<=";
            case classes_1.ComparisonOperationType.GreaterOrEqual:
                return ">=";
            case classes_1.ComparisonOperationType.Less:
                return "<";
            case classes_1.ComparisonOperationType.Greater:
                return ">";
            default:
                throw "Unknown ComparisonOperationType ";
        }
    };
    FilterPrinter._equalsOperationTypeToString = function (type) {
        switch (type) {
            case classes_1.EqualsOperationType.Equals:
                return "=";
            case classes_1.EqualsOperationType.NotEquals:
                return "!=";
            default:
                throw "Unknown EqualsOperationType ";
        }
    };
    return FilterPrinter;
}());
exports.FilterPrinter = FilterPrinter;
//# sourceMappingURL=filter_printer.js.map
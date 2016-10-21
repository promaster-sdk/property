"use strict";
var classes_1 = require("promaster-primitives/lib/classes");
var expr_type_1 = require("./expr_type");
function inferTypeMap(filter) {
    var typeMap = new Map();
    var lastPropertyType = new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown);
    _visit(filter.ast, lastPropertyType, typeMap);
    return typeMap;
}
exports.inferTypeMap = inferTypeMap;
function _visit(expr, lastPropertyType, typeMap) {
    if (expr instanceof classes_1.AndExpr) {
        var e = expr;
        for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
            var child = _a[_i];
            _visit(child, lastPropertyType, typeMap);
        }
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (expr instanceof classes_1.ComparisonExpr) {
        var e = expr;
        lastPropertyType = new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown);
        _visit(e.leftValue, lastPropertyType, typeMap);
        _visit(e.rightValue, lastPropertyType, typeMap);
        _visit(e.leftValue, lastPropertyType, typeMap);
        _visit(e.rightValue, lastPropertyType, typeMap);
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (expr instanceof classes_1.EmptyExpr) {
        typeMap.set(expr, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown));
    }
    else if (expr instanceof classes_1.EqualsExpr) {
        var e = expr;
        lastPropertyType = new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown);
        _visit(e.leftValue, lastPropertyType, typeMap);
        for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
            var range = _c[_b];
            _visit(range, lastPropertyType, typeMap);
        }
        _visit(e.leftValue, lastPropertyType, typeMap);
        for (var _d = 0, _e = e.rightValueRanges; _d < _e.length; _d++) {
            var range = _e[_d];
            _visit(range, lastPropertyType, typeMap);
        }
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (expr instanceof classes_1.IdentifierExpr) {
        var e = expr;
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Property, e.name));
        lastPropertyType = typeMap.get(e);
    }
    else if (expr instanceof classes_1.OrExpr) {
        var e = expr;
        for (var _f = 0, _g = e.children; _f < _g.length; _f++) {
            var child = _g[_f];
            _visit(child, lastPropertyType, typeMap);
        }
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (expr instanceof classes_1.ValueExpr) {
        var e = expr;
        switch (e.parsed.type) {
            case classes_1.PropertyType.Integer:
                typeMap.set(e, lastPropertyType);
                break;
            case classes_1.PropertyType.Amount:
                typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Amount));
                break;
            case classes_1.PropertyType.Text:
                typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Text));
                break;
        }
    }
    else if (expr instanceof classes_1.ValueRangeExpr) {
        var e = expr;
        _visit(e.min, lastPropertyType, typeMap);
        _visit(e.max, lastPropertyType, typeMap);
        _visit(e.min, lastPropertyType, typeMap);
        _visit(e.max, lastPropertyType, typeMap);
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Range));
    }
    else if (expr instanceof classes_1.NullExpr) {
        typeMap.set(expr, lastPropertyType);
    }
}
//# sourceMappingURL=filter_type_inferrer.js.map
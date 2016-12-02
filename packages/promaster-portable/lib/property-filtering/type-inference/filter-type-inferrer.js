"use strict";
var expr_type_1 = require("./expr-type");
function inferTypeMap(filter) {
    var typeMap = new Map();
    var lastPropertyType = new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown);
    _visit(filter.ast, lastPropertyType, typeMap);
    return typeMap;
}
exports.inferTypeMap = inferTypeMap;
function _visit(e, lastPropertyType, typeMap) {
    if (e.type === "AndExpr") {
        for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
            var child = _a[_i];
            lastPropertyType = _visit(child, lastPropertyType, typeMap);
        }
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (e.type === "ComparisonExpr") {
        lastPropertyType = new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown);
        lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
        lastPropertyType = _visit(e.rightValue, lastPropertyType, typeMap);
        lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
        lastPropertyType = _visit(e.rightValue, lastPropertyType, typeMap);
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (e.type === "EmptyExpr") {
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown));
    }
    else if (e.type === "EqualsExpr") {
        lastPropertyType = new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Unknown);
        lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
        for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
            var range = _c[_b];
            lastPropertyType = _visit(range, lastPropertyType, typeMap);
        }
        lastPropertyType = _visit(e.leftValue, lastPropertyType, typeMap);
        for (var _d = 0, _e = e.rightValueRanges; _d < _e.length; _d++) {
            var range = _e[_d];
            lastPropertyType = _visit(range, lastPropertyType, typeMap);
        }
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (e.type === "IdentifierExpr") {
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Property, e.name));
        lastPropertyType = typeMap.get(e) || lastPropertyType;
    }
    else if (e.type === "OrExpr") {
        for (var _f = 0, _g = e.children; _f < _g.length; _f++) {
            var child = _g[_f];
            lastPropertyType = _visit(child, lastPropertyType, typeMap);
        }
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Bool));
    }
    else if (e.type === "ValueExpr") {
        switch (e.parsed.type) {
            case "integer":
                typeMap.set(e, lastPropertyType);
                break;
            case "amount":
                typeMap.set(e, lastPropertyType);
                break;
            case "text":
                typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Text));
                break;
        }
    }
    else if (e.type === "ValueRangeExpr") {
        lastPropertyType = _visit(e.min, lastPropertyType, typeMap);
        lastPropertyType = _visit(e.max, lastPropertyType, typeMap);
        lastPropertyType = _visit(e.min, lastPropertyType, typeMap);
        lastPropertyType = _visit(e.max, lastPropertyType, typeMap);
        typeMap.set(e, new expr_type_1.ExprType(expr_type_1.ExprTypeEnum.Range));
    }
    else if (e.type === "NullExpr") {
        typeMap.set(e, lastPropertyType);
    }
    return lastPropertyType;
}
//# sourceMappingURL=filter-type-inferrer.js.map
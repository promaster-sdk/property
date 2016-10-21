"use strict";
(function (ExprTypeEnum) {
    ExprTypeEnum[ExprTypeEnum["Unknown"] = 0] = "Unknown";
    ExprTypeEnum[ExprTypeEnum["Bool"] = 1] = "Bool";
    ExprTypeEnum[ExprTypeEnum["Amount"] = 2] = "Amount";
    ExprTypeEnum[ExprTypeEnum["Property"] = 3] = "Property";
    ExprTypeEnum[ExprTypeEnum["Text"] = 4] = "Text";
    ExprTypeEnum[ExprTypeEnum["Range"] = 5] = "Range";
})(exports.ExprTypeEnum || (exports.ExprTypeEnum = {}));
var ExprTypeEnum = exports.ExprTypeEnum;
var ExprType = (function () {
    function ExprType(exprTypeEnum, propertyName) {
        if (exprTypeEnum === void 0) { exprTypeEnum = ExprTypeEnum.Unknown; }
        if (propertyName === void 0) { propertyName = null; }
        this._exprTypeEnum = exprTypeEnum;
        this._propertyName = propertyName;
    }
    Object.defineProperty(ExprType.prototype, "exprTypeEnum", {
        get: function () {
            return this._exprTypeEnum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExprType.prototype, "propertyName", {
        get: function () {
            return this._propertyName;
        },
        enumerable: true,
        configurable: true
    });
    return ExprType;
}());
exports.ExprType = ExprType;
//# sourceMappingURL=expr_type.js.map
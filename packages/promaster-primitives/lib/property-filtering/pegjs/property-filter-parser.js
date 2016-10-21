"use strict";
var Ast = require("../property-filter-ast");
var Parser = require("./parser_esm");
var parser = Parser;
exports.parserCallbacks = {
    createValueExpr: function (value_token) { return Ast.newValueExpr(value_token); },
    createNullExpr: function () { return Ast.newNullExpr(); },
    createIdentifierExpr: function (identToken) { return Ast.newIdentifierExpr(identToken); },
    createValueRangeExpr: function (v1, v2) { return Ast.newValueRangeExpr(v1, v2); },
    createEqualsExpr: function (leftValue, operationType, rightValueRanges) { return Ast.newEqualsExpr(leftValue, operationType, rightValueRanges); },
    createComparisonExpr: function (leftValue, operationType, rightValue) { return Ast.newComparisonExpr(leftValue, operationType, rightValue); },
    createAndExpr: function (children) { return Ast.newAndExpr(children); },
    createOrExpr: function (children) { return Ast.newOrExpr(children); }
};
var options = {
    startRule: 'start',
    tracer: undefined,
    callbacks: exports.parserCallbacks
};
function parse(text, throwOnInvalidSyntax) {
    if (throwOnInvalidSyntax === void 0) { throwOnInvalidSyntax = false; }
    try {
        var result = parser.parse(text, options);
        return result;
    }
    catch (error) {
        if (throwOnInvalidSyntax)
            throw error;
        else
            return undefined;
    }
}
exports.parse = parse;
//# sourceMappingURL=property-filter-parser.js.map
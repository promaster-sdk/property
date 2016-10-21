"use strict";
var PropertyValue = require("../product-properties/property-value");
var PropertyValueSet = require("../product-properties/property-value-set");
var Ast = require("./property-filter-ast");
var Parser = require("./pegjs/property-filter-parser");
var _cache = new Map();
exports.Empty = { text: "", ast: Ast.newEmptyExpr() };
function create(text, ast) {
    return { text: text, ast: ast };
}
function fromString(filter, onError) {
    if (filter == null)
        return exports.Empty;
    if (!_cache.has(filter)) {
        var adjustedFilter = _preProcessString(filter);
        if (adjustedFilter == null)
            return exports.Empty;
        var ast = _buildAst(adjustedFilter, false);
        if (ast == null) {
            if (onError != null)
                return onError(filter);
            return exports.Empty;
        }
        // TODO: Cannot compile in Dart
        //    var compiled = CompileAst(ast);
        _cache[filter] = create(adjustedFilter, ast);
    }
    return _cache[filter];
}
exports.fromString = fromString;
function isSyntaxValid(filter, propertyNames) {
    if (propertyNames === void 0) { propertyNames = undefined; }
    var adjusted = _preProcessString(filter);
    if (adjusted == null)
        return true;
    var ast = _buildAst(adjusted, false);
    if (ast == null)
        return false;
    if (propertyNames === undefined)
        return true;
    var parsed = create(filter, ast);
    var properties = getReferencedProperties(parsed);
    for (var _i = 0, _a = Array.from(properties); _i < _a.length; _i++) {
        var p = _a[_i];
        if (propertyNames.indexOf(p) === -1)
            return false;
    }
    return true;
}
exports.isSyntaxValid = isSyntaxValid;
function isValid(matchMissing, properties, filter) {
    return evaluate(filter.ast, properties, matchMissing);
}
exports.isValid = isValid;
function getReferencedProperties(filter) {
    var properties = new Set();
    _findProperties(filter.ast, properties);
    return properties;
}
exports.getReferencedProperties = getReferencedProperties;
function toString(filter) {
    return filter.text != null ? filter.text : "";
}
exports.toString = toString;
function equals(other, filter) {
    if (other === null || other === undefined)
        return false;
    if (filter === other)
        return true;
    return filter.text == filter.text;
}
exports.equals = equals;
/// Guarantees that all empty strings will be null, and all characters will be lower case
function _preProcessString(filter) {
    if (filter === undefined || filter == null || filter === "" || filter.trim().length == 0)
        return undefined;
    filter = filter.trim();
    var inString = false;
    var newFilter = "";
    for (var _i = 0, _a = filter.split(''); _i < _a.length; _i++) {
        var char = _a[_i];
        if (char == '"')
            inString = !inString;
        if (char != ' ' || inString)
            newFilter += char;
    }
    filter = newFilter.toString();
    return filter;
}
function _findProperties(e, properties) {
    switch (e.type) {
        case "AndExpr":
            for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
                var child = _a[_i];
                _findProperties(child, properties);
            }
            break;
        case "ComparisonExpr":
            _findProperties(e.leftValue, properties);
            _findProperties(e.rightValue, properties);
            break;
        case "EmptyExpr":
            // Do nothing
            break;
        case "EqualsExpr":
            _findProperties(e.leftValue, properties);
            for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
                var range = _c[_b];
                _findProperties(range, properties);
            }
            break;
        case "IdentifierExpr": {
            properties.add(e.name);
            break;
        }
        case "OrExpr":
            for (var _d = 0, _e = e.children; _d < _e.length; _d++) {
                var child = _e[_d];
                _findProperties(child, properties);
            }
            break;
        case "ValueExpr":
            // Do nothing
            break;
        case "ValueRangeExpr":
            _findProperties(e.min, properties);
            _findProperties(e.max, properties);
            break;
        case "NullExpr":
            // Do nothing
            break;
    }
}
function _buildAst(text, throwOnInvalidSyntax) {
    if (text == null)
        throw new Error("ArgumentNull: text");
    /*
     // TODO: Make singleton
     var parser = new PropertyFilterParserDefinition().build();

     var result = parser.parse(text);
     if (!result.status) {
     console.log(`Parsing failed, index: ${result.index}, expected: ${result.expected}, value '${result.value}'`);
     if (throwOnInvalidSyntax)
     throw `Syntax of PropertyFilter '${text}' is not valid.`;
     return null;
     }
     return result.value;
     */
    var result = Parser.parse(text, throwOnInvalidSyntax);
    return result;
}
function evaluate(e, properties, matchMissingIdentifiers) {
    if (e.type === "AndExpr") {
        for (var _i = 0, _a = e.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (!evaluate(child, properties, matchMissingIdentifiers))
                return false;
        }
        return true;
    }
    else if (e.type === "ComparisonExpr") {
        // Handle match missing identifier
        if (matchMissingIdentifiers && (_isMissingIdent(e.leftValue, properties)
            || _isMissingIdent(e.rightValue, properties))) {
            return true;
        }
        var left = evaluate(e.leftValue, properties, matchMissingIdentifiers);
        if (left == null)
            return false;
        var right = evaluate(e.rightValue, properties, matchMissingIdentifiers);
        if (right == null)
            return false;
        switch (e.operationType) {
            case "less":
                return PropertyValue.lessThan(left, right);
            case "greater":
                return PropertyValue.greaterThan(left, right);
            case "lessOrEqual":
                return PropertyValue.lessOrEqualTo(left, right);
            case "greaterOrEqual":
                return PropertyValue.greaterOrEqualTo(left, right);
            default:
                throw new Error("Unknown comparisontype: " + e.operationType);
        }
    }
    else if (e.type === "EmptyExpr") {
        return true;
    }
    else if (e.type === "EqualsExpr") {
        // Handle match missing identifier
        if (matchMissingIdentifiers) {
            if (_isMissingIdent(e.leftValue, properties) ||
                e.rightValueRanges.filter(function (vr) {
                    return _isMissingIdent(vr.min, properties)
                        || _isMissingIdent(vr.max, properties);
                }).length > 0) {
                return true;
            }
        }
        var left = evaluate(e.leftValue, properties, matchMissingIdentifiers);
        for (var _b = 0, _c = e.rightValueRanges; _b < _c.length; _b++) {
            var range = _c[_b];
            var rangeResult = evaluate(range, properties, matchMissingIdentifiers);
            var min = rangeResult[0];
            var max = rangeResult[1];
            // Match on NULL or inclusive in range
            if (((max === null || min === null) && left === null) ||
                (left !== null && min !== null && max !== null && (PropertyValue.greaterOrEqualTo(left, min) && PropertyValue.lessOrEqualTo(left, max)))) {
                return e.operationType == "equals";
            }
        }
        return e.operationType == "notEquals";
    }
    else if (e.type === "IdentifierExpr") {
        if (properties != null && PropertyValueSet.hasProperty(e.name, properties))
            return PropertyValueSet.get(e.name, properties);
        else
            return null;
    }
    else if (e.type === "OrExpr") {
        for (var _d = 0, _e = e.children; _d < _e.length; _d++) {
            var child = _e[_d];
            if (evaluate(child, properties, matchMissingIdentifiers))
                return true;
        }
        return false;
    }
    else if (e.type === "ValueExpr") {
        return e.parsed;
    }
    else if (e.type === "ValueRangeExpr") {
        return [
            evaluate(e.min, properties, matchMissingIdentifiers),
            evaluate(e.max, properties, matchMissingIdentifiers)];
    }
    else if (e.type === "NullExpr") {
        return null;
    }
    else {
        throw new Error("invalid type.");
    }
}
exports.evaluate = evaluate;
function _isMissingIdent(e, properties) {
    // If expression is an missing identifier it should match anything
    if (e.type === "IdentifierExpr") {
        if (!PropertyValueSet.hasProperty(e.name, properties))
            return true;
    }
    return false;
}
//# sourceMappingURL=property-filter.js.map
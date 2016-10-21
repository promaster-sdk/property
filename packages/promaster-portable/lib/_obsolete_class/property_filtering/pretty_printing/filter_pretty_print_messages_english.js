"use strict";
var classes_1 = require("promaster-primitives/lib/classes");
var FilterPrettyPrintMessagesEnglish = (function () {
    function FilterPrettyPrintMessagesEnglish() {
    }
    FilterPrettyPrintMessagesEnglish.prototype.comparisionOperationMessage = function (op, left, right) {
        return left + " " + FilterPrettyPrintMessagesEnglish._comparisonOperationTypeToString(op) + " " + right;
    };
    FilterPrettyPrintMessagesEnglish.prototype.equalsOperationMessage = function (op, left, right) {
        return left + " " + FilterPrettyPrintMessagesEnglish._equalsOperationTypeToString(op) + " " + right;
    };
    FilterPrettyPrintMessagesEnglish.prototype.rangeMessage = function (min, max) {
        return "between " + min + " and " + max;
    };
    FilterPrettyPrintMessagesEnglish.prototype.andMessage = function () {
        return "and";
    };
    FilterPrettyPrintMessagesEnglish.prototype.orMessage = function () {
        return "or";
    };
    FilterPrettyPrintMessagesEnglish.prototype.propertyNameMessage = function (propertyName) {
        return propertyName;
    };
    FilterPrettyPrintMessagesEnglish.prototype.propertyValueItemMessage = function (propertyName, pv) {
        return propertyName + "_" + pv;
    };
    FilterPrettyPrintMessagesEnglish.prototype.nullMessage = function () {
        return "null";
    };
    FilterPrettyPrintMessagesEnglish._comparisonOperationTypeToString = function (type) {
        switch (type) {
            case classes_1.ComparisonOperationType.LessOrEqual:
                return "must be less than or equal to";
            case classes_1.ComparisonOperationType.GreaterOrEqual:
                return "must be greater than or equal to";
            case classes_1.ComparisonOperationType.Less:
                return "must be less than";
            case classes_1.ComparisonOperationType.Greater:
                return "must be greater than";
            default:
                throw "Unknown ComparisonOperationType ";
        }
    };
    FilterPrettyPrintMessagesEnglish._equalsOperationTypeToString = function (type) {
        switch (type) {
            case classes_1.EqualsOperationType.Equals:
                return "must be";
            case classes_1.EqualsOperationType.NotEquals:
                return "must not be";
            default:
                throw "Unknown EqualsOperationType ";
        }
    };
    return FilterPrettyPrintMessagesEnglish;
}());
exports.FilterPrettyPrintMessagesEnglish = FilterPrettyPrintMessagesEnglish;
//# sourceMappingURL=filter_pretty_print_messages_english.js.map
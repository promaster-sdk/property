"use strict";
var Amount = require('../measure/amount');
var Units = require('../measure/units');
var compare_utils_1 = require("../utils/compare_utils");
// Functions
function create(type, value) {
    if (type == undefined || type == null)
        throw new Error("Argument 'type' must be specified.");
    if (value == undefined || value == null)
        throw new Error("Argument 'value' must be specified.");
    if (type === "amount")
        return { type: "amount", value: value };
    if (type === "text")
        return { type: "text", value: value };
    if (type === "integer")
        return { type: "integer", value: value };
    throw new Error("Unknown 'type' " + type + ".");
}
exports.create = create;
function fromString(encodedValue) {
    var result = _fromSerializedStringOrUndefinedIfInvalidString(encodedValue);
    if (result === null)
        console.log("PropertyValue.fromString(): Could not parse encoded value: '" + encodedValue + "'");
    return result;
}
exports.fromString = fromString;
function fromAmount(amountValue) {
    if (!amountValue)
        throw new Error("null: value");
    var type;
    var value;
    if (Amount.isQuantity("Discrete", amountValue)) {
        value = Amount.valueAs(Units.Integer, amountValue);
        type = "integer";
    }
    else {
        value = amountValue;
        type = "amount";
    }
    return { type: type, value: value };
}
exports.fromAmount = fromAmount;
/// NOTE: The string value should *NOT* be encoded in any way (such as being enclosed in
/// quotation marks or having quotation marks encoded as %22). If you want to create
/// a value from a string that is encoded then use the Parse() or TryParse() methods instead.
function fromText(textValue) {
    if (textValue == null)
        throw new Error("value");
    return { type: "text", value: textValue };
}
exports.fromText = fromText;
function fromInteger(integerValue) {
    return { type: "integer", value: integerValue };
}
exports.fromInteger = fromInteger;
function getInteger(value) {
    if (value.type === "integer")
        return value.value;
    else
        return undefined;
}
exports.getInteger = getInteger;
function getAmount(value) {
    if (value.type === "amount")
        return value.value;
    else
        return undefined;
}
exports.getAmount = getAmount;
function getText(value) {
    if (value.type === "text")
        return value.value;
    else
        return undefined;
}
exports.getText = getText;
function valueAs(unit, value) {
    var amount = getAmount(value);
    if (amount === undefined)
        return undefined;
    var value2 = Amount.valueAs(unit, amount);
    return value2;
}
exports.valueAs = valueAs;
function toString(value) {
    if (value.type === "amount") {
        var valueString = value.value.value.toString();
        var unitString = Units.getStringFromUnit(value.value.unit);
        return valueString + ":" + unitString;
    }
    else if (value.type === "text") {
        return _encodeToSafeString(value.value);
    }
    else if (value.type === "integer") {
        return value.value.toString();
    }
    throw new Error("Invalid type.");
}
exports.toString = toString;
function compareTo(left, right) {
    switch (left.type) {
        case "integer":
            if (right.type === "integer")
                return compare_utils_1.compareNumbers(left.value, right.value, 0);
            throw new Error("Unexpected error comparing integers");
        case "amount":
            if (right.type === "amount")
                return Amount.compareTo(left.value, right.value);
            throw new Error("Unexpected error comparing amounts");
        case "text":
            if (right.type === "text")
                return compare_utils_1.compareIgnoreCase(left.value, right.value);
            throw new Error("Unexpected error comparing texts");
        default:
            throw new Error("Unknown property type");
    }
}
exports.compareTo = compareTo;
function equals(left, right) {
    if (left === undefined || right === undefined) {
        return false;
    }
    return compareTo(left, right) === 0;
}
exports.equals = equals;
function lessThan(left, right) {
    if (left === undefined || right === undefined) {
        return false;
    }
    if (right.type != left.type)
        return false;
    return compareTo(left, right) < 0;
}
exports.lessThan = lessThan;
function lessOrEqualTo(left, right) {
    if (left === undefined || right === undefined) {
        return false;
    }
    if (right.type != left.type)
        return false;
    return compareTo(left, right) <= 0;
}
exports.lessOrEqualTo = lessOrEqualTo;
function greaterThan(left, right) {
    if (left === undefined || right === undefined) {
        return false;
    }
    if (right.type != left.type)
        return false;
    return compareTo(left, right) > 0;
}
exports.greaterThan = greaterThan;
function greaterOrEqualTo(left, right) {
    if (left === undefined || right === undefined) {
        return false;
    }
    if (right.type != left.type)
        return false;
    return compareTo(left, right) >= 0;
}
exports.greaterOrEqualTo = greaterOrEqualTo;
/// RULES:
///
/// Strings-values *MUST* be enclosed in double quote (") and if they contains
/// double quote (") characters they *MUST* be encoded as %22.
/// No other encodings are supported.
///
/// Integer-values should not be enclosed in quotation marks.
///
/// Amount-values must be in format Value:Unit without quotation marks.
function _fromSerializedStringOrUndefinedIfInvalidString(encodedValue) {
    if (encodedValue === "")
        return fromText("");
    if (encodedValue == null)
        return undefined;
    var deserializedValue;
    if (encodedValue.charAt(0) === "\"" && encodedValue.charAt(encodedValue.length - 1) === "\"") {
        var valueString = _decodeFromSafeString(encodedValue);
        deserializedValue = fromText(valueString);
    }
    else if (encodedValue.indexOf(":") != -1) {
        var split2 = encodedValue.split(':');
        var unitString = split2[1];
        if (unitString.toLowerCase() == "integer") {
            var integerValue = parseInt(split2[0]);
            if (integerValue == null)
                return undefined;
            deserializedValue = fromInteger(integerValue);
        }
        else {
            var stringValue = split2[0];
            var doubleValue = parseFloat(stringValue);
            if (doubleValue == null)
                return undefined;
            if (!Units.isUnit(unitString))
                return undefined;
            var unit = Units.getUnitFromString(unitString);
            var decimalCount = 0;
            var pointIndex = stringValue.indexOf('.');
            if (pointIndex >= 0)
                decimalCount = stringValue.length - pointIndex - 1;
            var amount = Amount.create(doubleValue, unit, decimalCount);
            deserializedValue = fromAmount(amount);
        }
    }
    else {
        var integerValue = parseInt(encodedValue);
        if (integerValue == null)
            return undefined;
        deserializedValue = fromInteger(integerValue);
    }
    return deserializedValue;
}
function _encodeToSafeString(unsafeString) {
    // We use '"' to enclose a string so it must be encoded as %22 inside strings
    if (unsafeString == null)
        return "";
    var safeString = unsafeString;
    safeString = safeString.replace(/"/g, "%22");
    return "\"" + safeString + "\"";
}
function _decodeFromSafeString(safeString) {
    // We use '"' to enclose a string so it must be encoded as %22 inside strings
    //    var unsafeString = safeString.Trim('"');
    var unsafeString = safeString;
    while (unsafeString.length > 0 && unsafeString.charAt(0) === '"')
        unsafeString = unsafeString.substring(1);
    while (unsafeString.length > 0 && unsafeString.charAt(unsafeString.length - 1) === '"')
        unsafeString = unsafeString.substring(0, unsafeString.length - 1);
    unsafeString = unsafeString.replace(/%22/g, "\"");
    //// **** OBSOLETE BEGIN - WE ONLY SUPPORT DECODING OF THESE CHARS FOR BACKWARDS COMPABILITY ****
    //unsafeString = unsafeString.replaceAll(/%3B/g, ";");
    //unsafeString = unsafeString.replaceAll(/%3D/g, "=");
    //unsafeString = unsafeString.replaceAll(/%3A/g, ":");
    //// **** OBSOLETE END ****
    return unsafeString;
}
//# sourceMappingURL=property-value.js.map
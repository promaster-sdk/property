"use strict";
var PropertyValue = require("./property-value");
// Functions
function fromMap(map) {
    var newSet = {};
    map.forEach(function (value, key) {
        newSet[key] = value;
    });
    return newSet;
}
exports.fromMap = fromMap;
function fromObject(obj) {
    return obj;
}
exports.fromObject = fromObject;
function fromString(encodedValueSet) {
    var err = function () {
        throw new Error(encodedValueSet + " is not a valid PropertyValueSet");
    };
    return fromStringOrError(err, encodedValueSet);
}
exports.fromString = fromString;
function fromStringOrError(onError, encodedValueSet) {
    if (!encodedValueSet || encodedValueSet.length === 0) {
        return {};
    }
    var entries = _stringToEntriesOrUndefinedIfInvalidString(encodedValueSet);
    if (entries === undefined) {
        return onError(encodedValueSet);
    }
    else {
        return entries;
    }
}
exports.fromStringOrError = fromStringOrError;
function fromProperty(propertyName, propertyValue) {
    return (_a = {},
        _a[propertyName] = propertyValue,
        _a
    );
    var _a;
}
exports.fromProperty = fromProperty;
function isNullOrEmpty(propertyValueSet) {
    return propertyValueSet == null || propertyValueSet == {};
}
exports.isNullOrEmpty = isNullOrEmpty;
function count(set) {
    return Object.keys(set).length;
}
exports.count = count;
function get(propertyName, set) {
    if (!set.hasOwnProperty(propertyName))
        return undefined;
    return set[propertyName];
}
exports.get = get;
function hasProperty(propertyName, set) {
    return set.hasOwnProperty(propertyName);
}
exports.hasProperty = hasProperty;
function getPropertyNames(set) {
    return Object.keys(set);
}
exports.getPropertyNames = getPropertyNames;
function merge(mergeWith, set) {
    return Object.assign({}, set, mergeWith);
}
exports.merge = merge;
function set(propertyName, propertyValue, set) {
    return Object.assign({}, set, (_a = {}, _a[propertyName] = propertyValue, _a));
    var _a;
}
exports.set = set;
function setAmount(propertyName, amountValue, set) {
    return Object.assign({}, set, (_a = {}, _a[propertyName] = PropertyValue.fromAmount(amountValue), _a));
    var _a;
}
exports.setAmount = setAmount;
function setInteger(propertyName, integerValue, set) {
    return Object.assign({}, set, (_a = {}, _a[propertyName] = PropertyValue.fromInteger(integerValue), _a));
    var _a;
}
exports.setInteger = setInteger;
function setText(propertyName, textValue, set) {
    return Object.assign({}, set, (_a = {}, _a[propertyName] = PropertyValue.fromText(textValue), _a));
    var _a;
}
exports.setText = setText;
/// If a property exists with the same name in the PropertyValueSet as in the
// replacement set then the value of that property will be replaced.
function setValues(replacementSet, set) {
    return Object.assign({}, set, replacementSet);
}
exports.setValues = setValues;
function keepProperties(propertyNames, set) {
    var newSet = {};
    for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
        var name_1 = propertyNames_1[_i];
        newSet[name_1] = set[name_1];
    }
    return newSet;
}
exports.keepProperties = keepProperties;
function removeProperties(propertyNames, set) {
    var newSet = {};
    for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
        var name_2 = _a[_i];
        if (propertyNames.indexOf(name_2) === -1)
            newSet[name_2] = set[name_2];
    }
    return newSet;
}
exports.removeProperties = removeProperties;
function removeProperty(propertyName, set) {
    return removeProperties([propertyName], set);
}
exports.removeProperty = removeProperty;
/// Gets an integer value, if the value is missing the onMissing function's
/// return value is returned.
function getValue(propertyName, set) {
    var value = set[propertyName];
    return value;
}
exports.getValue = getValue;
/// Gets an amount value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
function getAmount(propertyName, set) {
    if (!hasProperty(propertyName, set))
        return undefined;
    return PropertyValue.getAmount(set[propertyName]);
}
exports.getAmount = getAmount;
/// Gets an integer value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
function getText(propertyName, set) {
    if (!hasProperty(propertyName, set))
        return undefined;
    return PropertyValue.getText(set[propertyName]);
}
exports.getText = getText;
/// Gets an integer value, if the value is missing or of the wrong type the onError function's
/// return value is returned.
function getInteger(propertyName, set) {
    if (!hasProperty(propertyName, set))
        return undefined;
    return PropertyValue.getInteger(set[propertyName]);
}
exports.getInteger = getInteger;
function addPrefixToValues(prefix, set) {
    var newSet = {};
    for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
        var name_3 = _a[_i];
        newSet[prefix + name_3] = set[name_3];
    }
    return newSet;
}
exports.addPrefixToValues = addPrefixToValues;
function getValuesWithPrefix(prefix, removePrefix, set) {
    var newSet = {};
    for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
        var name_4 = _a[_i];
        if (name_4.startsWith(prefix)) {
            newSet[removePrefix ? name_4.substring(prefix.length) : name_4] = set[name_4];
        }
    }
    return newSet;
}
exports.getValuesWithPrefix = getValuesWithPrefix;
function getValuesWithoutPrefix(prefix, removePrefix, set) {
    var newSet = {};
    for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
        var name_5 = _a[_i];
        if (!name_5.startsWith(prefix)) {
            newSet[removePrefix ? name_5.substring(prefix.length) : name_5] = set[name_5];
        }
    }
    return newSet;
}
exports.getValuesWithoutPrefix = getValuesWithoutPrefix;
function getValuesOfType(type, set) {
    var newSet = {};
    for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
        var name_6 = _a[_i];
        if (set[name_6].type === type) {
            newSet[name_6] = set[name_6];
        }
    }
    return newSet;
}
exports.getValuesOfType = getValuesOfType;
// TODO: This should not exist as it is the same as keepProperties?
function getProperties(propertiesToGet, set) {
    return keepProperties(propertiesToGet, set);
}
exports.getProperties = getProperties;
function toString(set) {
    var sb = "";
    for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
        var name_7 = _a[_i];
        sb += name_7 + "=" + PropertyValue.toString(set[name_7]);
    }
    return sb;
}
exports.toString = toString;
function toStringInSpecifiedOrder(order) {
    var sb = "";
    for (var _i = 0, order_1 = order; _i < order_1.length; _i++) {
        var name_8 = order_1[_i];
        sb += name_8 + "=" + PropertyValue.toString(set[name_8]);
    }
    return sb;
}
exports.toStringInSpecifiedOrder = toStringInSpecifiedOrder;
function equals(other, set) {
    if (other === null || other === undefined)
        return false;
    if (set === other)
        return true;
    if (Object.keys(set).length !== Object.keys(other).length)
        return false;
    for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
        var name_9 = _a[_i];
        if (!PropertyValue.equals(other[name_9], set[name_9])) {
            return false;
        }
    }
    return true;
}
exports.equals = equals;
/// RULES:
/// Format should be
/// Name1=Value1;Name2=Value2;Name3=Value3
/// Values that represents strings must be enclosed in double quote (") and if they contains double quote characters they must be encoded as %22.
function _stringToEntriesOrUndefinedIfInvalidString(encodedValueSet) {
    var entries = {};
    // Add extra semicolon on the end to close last name/value pair
    var toParse = encodedValueSet;
    if (!toParse.endsWith(";"))
        toParse += ";";
    //StringBuffer name = new StringBuffer();
    var name = "";
    //StringBuffer value = new StringBuffer();
    var value = "";
    var isInNamePart = true;
    var isInQuote = false;
    for (var i = 0; i < toParse.length; i++) {
        var c = toParse[i];
        switch (c) {
            case '=':
                if (!isInQuote) {
                    if (!isInNamePart) {
                        // Parse error
                        return undefined;
                    }
                    isInNamePart = false;
                }
                else {
                    value = value + c;
                }
                break;
            case ';':
                if (!isInQuote) {
                    if (isInNamePart) {
                        // Parse error
                        return undefined;
                    }
                    var entryValue = void 0;
                    entryValue = PropertyValue.fromString(value.toString());
                    //              if (!PropertyValue.TryParse(value.ToString(), out entryValue)) {
                    if (entryValue === undefined) {
                        // Parse error
                        return undefined;
                    }
                    entries[name.toString()] = entryValue;
                    isInNamePart = true;
                    //name = new StringBuffer();
                    //value = new StringBuffer();
                    name = "";
                    value = "";
                }
                else {
                    value = value + c;
                }
                break;
            case '"':
                isInQuote = !isInQuote;
                value = value + c;
                break;
            default:
                if (isInNamePart) {
                    name = name + c;
                }
                else {
                    value = value + c;
                }
                break;
        }
    }
    return entries;
}
//# sourceMappingURL=property-value-set.js.map
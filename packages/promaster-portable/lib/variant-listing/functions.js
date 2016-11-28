"use strict";
var promaster_primitives_1 = require("promaster-primitives");
function buildAllPropertyValueSets(explicitPropertyValueSet, variableProperties, allProperties) {
    if (variableProperties.find(function (property) { return promaster_primitives_1.Units.getStringFromQuantityType(property.quantity).toLocaleLowerCase() !== 'discrete'; })) {
        throw new Error('Can\'t build variants from non-discrete properties.');
    }
    var propertyValueSets = new Array(explicitPropertyValueSet);
    variableProperties.forEach(function (property) {
        var limit = 30;
        if (propertyValueSets.length > limit) {
            console.warn('Discarded ' + (propertyValueSets.length - limit) + ' propertyValueSets, since there are too many combinations.');
            propertyValueSets = propertyValueSets.slice(0, limit);
        }
        var propertyValueSets1 = propertyValueSets
            .map(function (partialPropertyValueSet) {
            var builder = partialPropertyValueSet;
            return !property.valueItems
                ? []
                : property.valueItems
                    .map(function (propertyValueItem) {
                    var integerValue = promaster_primitives_1.PropertyValue.getInteger(propertyValueItem.value);
                    if (integerValue === undefined) {
                        console.warn('Invalid data in valueItem:', propertyValueItem);
                        return undefined;
                    }
                    var propertyValue = promaster_primitives_1.PropertyValue.create("integer", integerValue);
                    builder = promaster_primitives_1.PropertyValueSet.set(property.name, propertyValue, builder);
                    var propertyValueSet = builder;
                    return promaster_primitives_1.PropertyFilter.isValidMatchMissing(propertyValueSet, propertyValueItem.validationFilter)
                        ? propertyValueSet
                        : undefined;
                })
                    .filter(function (possiblyUndefined) { return !!possiblyUndefined; });
        })
            .reduce(function (soFar, next) { return soFar.concat(next); }, []);
        propertyValueSets = propertyValueSets1;
    });
    var defaults1 = allProperties
        .filter(function (property) { return !!property.defaultValues && !!property.defaultValues.length; })
        .map(function (property) { return ((_a = {},
        _a[property.name] = property.defaultValues[0].value,
        _a
    )); var _a; });
    var defaults = defaults1.reduce(function (soFar, next) { return promaster_primitives_1.PropertyValueSet.merge(soFar, next); });
    var firstOptions1 = allProperties
        .filter(function (property) { return !!property.valueItems && !!property.valueItems.length; })
        .map(function (property) { return ((_a = {},
        _a[property.name] = property.valueItems[0].value,
        _a
    )); var _a; });
    var firstOptions = firstOptions1.reduce(function (soFar, next) { return promaster_primitives_1.PropertyValueSet.merge(soFar, next); });
    var fallbacks = promaster_primitives_1.PropertyValueSet.setValues(defaults, firstOptions);
    propertyValueSets = propertyValueSets.map(function (propertyValueSet) { return promaster_primitives_1.PropertyValueSet.setValues(propertyValueSet, fallbacks); });
    var before = propertyValueSets.length;
    propertyValueSets = propertyValueSets
        .filter(function (propertyValueSet) { return allProperties
        .filter(function (property) { return !!property.valueItems && !!property.valueItems.length; })
        .every(function (property) {
        var valueItem = property.valueItems
            .find(function (v) { return promaster_primitives_1.PropertyValue.equals(promaster_primitives_1.PropertyValueSet.getValue(property.name, propertyValueSet), v.value); });
        if (!valueItem) {
            console.warn('Property is set to non-existing value (bad default?): ' + property.name);
            throw new Error("'Property is set to non-existing value (bad default?)");
        }
        return valueItem && promaster_primitives_1.PropertyFilter.isValid(propertyValueSet, valueItem.validationFilter);
    }); });
    var loss = propertyValueSets.length - before;
    if (loss > 0) {
        console.warn('Discarded ' + loss + ' variants because they are invalid. Implement recursive search with backtracking over default values to find valid combos.');
    }
    return propertyValueSets;
}
exports.buildAllPropertyValueSets = buildAllPropertyValueSets;
//# sourceMappingURL=functions.js.map
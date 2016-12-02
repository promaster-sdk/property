"use strict";
var R = require("ramda");
var promaster_primitives_1 = require("@promaster/promaster-primitives");
function buildAllPropertyValueSets(explicitPropertyValueSet, variableProperties, allProperties) {
    return (buildAllPropertyValueSetsExtended(explicitPropertyValueSet, variableProperties, allProperties, 100)).variants;
}
exports.buildAllPropertyValueSets = buildAllPropertyValueSets;
function buildAllPropertyValueSetsExtended(explicitPropertyValueSet, variableProperties, allProperties, limit) {
    var blackListedProperties = [];
    var blacklistedPropertyFilters = [];
    var newVariableProperties = variableProperties
        .filter(function (property) {
        if (promaster_primitives_1.Units.getStringFromQuantityType(property.quantity).toLocaleLowerCase() !== "discrete") {
            blackListedProperties.push(property);
            if (property.validation_filter.text !== "") {
                blacklistedPropertyFilters.push(property.validation_filter);
            }
            if (property.visibility_filter.text !== "") {
                blacklistedPropertyFilters.push(property.visibility_filter);
            }
            return false;
        }
        else {
            return true;
        }
    })
        .map(function (property) {
        if (property.visibility_filter.text !== "") {
            blacklistedPropertyFilters = blacklistedPropertyFilters.filter(function (bpf) { return !((property.visibility_filter.text.split("&")).reduce(function (acc, filterPart) { return acc || filterPart.toLowerCase() === bpf.text.toLowerCase(); }, false)); });
        }
        return property;
    })
        .map(function (property) {
        var newPV = property.value.filter(function (value) { return blacklistedPropertyFilters.reduce(function (acc, bpf) { return acc && !(promaster_primitives_1.PropertyFilter.isValid((_a = {}, _a[property.name] = value.value, _a), bpf)); var _a; }, true); });
        return Object.assign({}, property, { value: newPV });
    });
    if (newVariableProperties.find(function (property) { return promaster_primitives_1.Units.getStringFromQuantityType(property.quantity).toLocaleLowerCase() !== "discrete"; })) {
        throw new Error("Can\'t build variants from non-discrete properties.");
    }
    var prunedValues = false;
    var propertyValueSets = new Array(explicitPropertyValueSet);
    newVariableProperties.forEach(function (property) {
        if (limit > 0 && propertyValueSets.length > limit) {
            console.warn("Discarded " + (propertyValueSets.length - limit) + " of " + propertyValueSets.length + " propertyValueSets for " + property.name + ", since there are too many combinations.");
            prunedValues = true;
            propertyValueSets = propertyValueSets.slice(0, limit);
        }
        var propertyValueSets1 = propertyValueSets
            .map(function (partialPropertyValueSet) {
            return !property.value
                ? []
                : property.value
                    .map(function (propertyValueItem) {
                    if (propertyValueItem.value.type !== "integer") {
                        console.warn("Invalid data in valueItem:", propertyValueItem);
                        return undefined;
                    }
                    var propertyValueSet = R.mergeWith(R.merge, partialPropertyValueSet, (_a = {}, _a[property.name] = { type: "integer", value: propertyValueItem.value.value }, _a));
                    return promaster_primitives_1.PropertyFilter.isValidMatchMissing(propertyValueSet, propertyValueItem.property_filter)
                        ? propertyValueSet
                        : undefined;
                    var _a;
                })
                    .filter(function (possiblyUndefined) { return possiblyUndefined !== undefined; });
        })
            .reduce(function (soFar, next) { return soFar.concat(next); }, []);
        propertyValueSets = propertyValueSets1;
    });
    var defaults1 = allProperties
        .filter(function (property) { return !!property.def_value && !!property.def_value.length; })
        .map(function (property) { return ((_a = {},
        _a[property.name] = property.def_value[0].value,
        _a
    )); var _a; });
    var defaults = defaults1.reduce(function (soFar, next) { return promaster_primitives_1.PropertyValueSet.merge(soFar, next); }, promaster_primitives_1.PropertyValueSet.Empty);
    var firstOptions1 = allProperties
        .filter(function (property) { return !!property.value && !!property.value.length; })
        .map(function (property) { return ((_a = {},
        _a[property.name] = property.value[0].value,
        _a
    )); var _a; });
    var firstOptions = firstOptions1.reduce(function (soFar, next) { return promaster_primitives_1.PropertyValueSet.merge(soFar, next); }, promaster_primitives_1.PropertyValueSet.Empty);
    var fallbacks = promaster_primitives_1.PropertyValueSet.setValues(defaults, firstOptions);
    propertyValueSets = propertyValueSets.map(function (propertyValueSet) { return promaster_primitives_1.PropertyValueSet.setValues(propertyValueSet, fallbacks); });
    var before = propertyValueSets.length;
    propertyValueSets = propertyValueSets
        .filter(function (propertyValueSet) { return allProperties
        .filter(function (property) { return !!property.value && !!property.value.length; })
        .every(function (property) {
        var valueItem = property.value
            .find(function (v) { return promaster_primitives_1.PropertyValue.equals(promaster_primitives_1.PropertyValueSet.getValue(property.name, propertyValueSet), v.value); });
        if (!valueItem) {
            console.warn("Property is set to non-existing value (bad default?): " + property.name);
            throw new Error("Property is set to non-existing value (bad default?)");
        }
        return valueItem && promaster_primitives_1.PropertyFilter.isValid(propertyValueSet, valueItem.property_filter);
    }); });
    var loss = propertyValueSets.length - before;
    if (loss > 0) {
        console.warn("Discarded " + loss + " variants because they are invalid. Implement recursive search with backtracking over default values to find valid combos.");
    }
    var extendedVariants = propertyValueSets.map(function (variant) { return ({
        variants: variant,
        url: Object.keys(variant).map(function (property) { return (property + "=" + variant[property].value); }).join("&") }); }, {});
    return {
        variants: extendedVariants,
        pruned: prunedValues,
    };
}
exports.buildAllPropertyValueSetsExtended = buildAllPropertyValueSetsExtended;
//# sourceMappingURL=functions.js.map
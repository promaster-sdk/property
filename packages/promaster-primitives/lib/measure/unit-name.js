"use strict";
// We keep a global repository of Labels becasue if a Unit object is derived from arithmetic operations
// it may still be considered equal to an existing unit and thus should have the same label.
var _typeLabels = new Map();
function withLabel(label, unit) {
    _typeLabels.set(unit, label);
    return unit;
}
exports.withLabel = withLabel;
function getName(unit) {
    var label = _typeLabels.get(unit);
    if (label === undefined)
        return buildDerivedName(unit);
    return label;
}
exports.getName = getName;
function buildDerivedName(unit) {
    switch (unit.innerUnit.type) {
        case "alternate":
            return unit.innerUnit.symbol;
        case "base":
            return unit.innerUnit.symbol;
        case "product":
            return productUnitBuildDerivedName(unit);
        case "transformed":
            return "";
    }
    throw new Error("Unknown innerUnit " + JSON.stringify(unit));
}
function productUnitBuildDerivedName(unit) {
    var comparePow = function (a, b) {
        if (a.pow > b.pow)
            return 1;
        else if (a.pow < b.pow)
            return -1;
        else
            return 0;
    };
    var pospow = getElements(unit).filter(function (e) { return e.pow > 0; });
    pospow.sort(comparePow); // orderby e.Pow descending select e;
    var posname = productUnitBuildNameFromElements(pospow);
    var negpow = getElements(unit).filter(function (e) { return e.pow < 0; });
    negpow.sort(comparePow); // orderby e.Pow ascending select e;
    var negname = productUnitBuildNameFromElements(negpow);
    var name = posname;
    if (negname.length > 0) {
        if (name.length == 0) {
            name += "1";
        }
        name += "/" + negname;
    }
    return name;
}
function getElements(unit) {
    if (unit.innerUnit.type === "product") {
        return unit.innerUnit.elements;
    }
    return [];
}
function productUnitBuildNameFromElements(elements) {
    var name = "";
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var e = elements_1[_i];
        name += getName(e.unit);
        switch (Math.abs(e.pow)) {
            case 1:
                break;
            case 2:
                name += "²";
                break;
            case 3:
                name += "³";
                break;
            default:
                name += "^" + Math.abs(e.pow).toString();
                break;
        }
    }
    return name;
}
//# sourceMappingURL=unit-name.js.map
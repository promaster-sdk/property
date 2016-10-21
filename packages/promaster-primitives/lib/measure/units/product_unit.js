"use strict";
var UnitConverter = require("../unit_converters/unit_converter");
var Unit = require("../unit");
var element_1 = require("./element");
/// This class represents units formed by the product of rational powers of
/// existing units.
///
/// This class maintains the canonical form of this product (simplest
/// form after factorization). For example:
/// METER.pow(2).divide(METER) returns METER.
///// Default constructor (used solely to create ONE instance).
//constructor() {
//  // The super-class contructor adds elements but we cannot have any in the ONE instace because
//  // If an element in the list contains a ProductUnit it will causes stack overflow in hashCode
//  // becuase ProductUnit hashCode calls the elements hashcode which in turn calls back to the ProductUnit's hashCode!!!!!
//  this._elements.clear();
//}
/// Default constructor (used solely to create ONE instance).
function create(quantity, elements) {
    return Unit.create(quantity, elements, { type: "product" });
    // // The super-class contructor adds elements but we cannot have any in the ONE instace because
    // // If an element in the list contains a ProductUnit it will causes stack overflow in hashCode
    // // becuase ProductUnit hashCode calls the elements hashcode which in turn calls back to the ProductUnit's hashCode!!!!!
    // return {
    // 	quantity,
    // 	// Init elements to standard, some other constructors can override this by re-setting _elements
    // 	elements: elements,
    // }
}
exports.create = create;
/// Product unit constructor.
/// <param name="elements">the product elements.</param>
function fromElements(quantity, elements) {
    var newProductUnit = create(quantity, elements);
    //newProductUnit._elements.clear();
    //newProductUnit._elements.addAll(elements);
    return newProductUnit;
}
exports.fromElements = fromElements;
/// Creates the unit defined from the product of the specifed elements.
/// <param name="leftElems">left multiplicand elements</param>
/// <param name="rightElems">right multiplicand elements.</param>
function fromProduct(quantity, leftElems, rightElems) {
    // If we have several elements of the same unit then we can merge them by summing their power
    var allElements = [];
    allElements.push.apply(allElements, leftElems);
    allElements.push.apply(allElements, rightElems);
    var resultElements = [];
    //      var unitGroups = allElements.GroupBy(e => e.Unit);
    var unitGroups = new Map();
    //allElements.forEach((v:Element) => unitGroups.putIfAbsent(v._unit, () => <Element>[]).add(v));
    allElements.forEach(function (v) {
        var group = unitGroups.get(v.unit);
        if (group === undefined)
            unitGroups.set(v.unit, [v]);
        else
            group.push(v);
    });
    unitGroups.forEach(function (unitGroup, unit) {
        //      for (var unitGroup in unitGroups.values)
        //      {
        //var sumpow = unitGroup.sum(e => e.Pow);
        var sumpow = unitGroup.reduce(function (prev, element) { return prev + element.pow; }, 0);
        if (sumpow != 0) {
            resultElements.push(element_1.create(unit, sumpow));
        }
        //      }
    });
    //this._elements = resultElements;
    return create(quantity, resultElements);
}
exports.fromProduct = fromProduct;
/// <summary>
/// Returns the product of the specified units.
/// </summary>
/// <param name="left">the left unit operand.</param>
/// <param name="right">the right unit operand.</param>
/// <returns>left * right</returns>
function Product(quantity, left, right) {
    var leftelements = left.elements;
    var rightelements = right.elements;
    return fromProduct(quantity, leftelements, rightelements);
}
exports.Product = Product;
/// Returns the quotient of the specified units.
/// <param name="left">the dividend unit operand.</param>
/// <param name="right">right the divisor unit operand.</param>
/// <returns>dividend / divisor</returns>
function Quotient(quantity, left, right) {
    var leftelements = left.elements;
    var invertedRightelements = [];
    for (var _i = 0, _a = right.elements; _i < _a.length; _i++) {
        var element = _a[_i];
        invertedRightelements.push(element_1.create(element.unit, -element.pow));
    }
    return fromProduct(quantity, leftelements, invertedRightelements);
}
exports.Quotient = Quotient;
// Implements abstract method.
function getStandardUnit(quantity, unit) {
    var standardelements = [];
    for (var _i = 0, _a = unit.elements; _i < _a.length; _i++) {
        var e = _a[_i];
        var newstandardunit = Unit.getStandardUnit(e.unit);
        standardelements.push(element_1.create(newstandardunit, e.pow));
    }
    return fromElements(quantity, standardelements);
}
exports.getStandardUnit = getStandardUnit;
// Implements abstract method.
function toStandardUnit(unit) {
    var converter = UnitConverter.Identity;
    for (var _i = 0, _a = unit.elements; _i < _a.length; _i++) {
        var element = _a[_i];
        var conv = Unit.toStandardUnit(element.unit);
        var pow = element.pow;
        if (pow < 0) {
            pow = -pow;
            conv = UnitConverter.inverse(conv);
        }
        for (var i = 1; i <= pow; i++) {
            converter = UnitConverter.concatenate(conv, converter);
        }
    }
    return converter;
}
exports.toStandardUnit = toStandardUnit;
function buildDerivedName(unit) {
    //      var pospow = from e in _elements where e.Pow > 0 orderby e.Pow descending select e;
    //      var posname = BuildNameFromElements(pospow);
    //      var negpow = from e in _elements where e.Pow < 0 orderby e.Pow ascending select e;
    //      var negname = BuildNameFromElements(negpow);
    var comparePow = function (a, b) {
        if (a.pow > b.pow)
            return 1;
        else if (a.pow < b.pow)
            return -1;
        else
            return 0;
    };
    var pospow = unit.elements.filter(function (e) { return e.pow > 0; });
    pospow.sort(comparePow); // orderby e.Pow descending select e;
    var posname = buildNameFromElements(pospow);
    var negpow = unit.elements.filter(function (e) { return e.pow < 0; });
    negpow.sort(comparePow); // orderby e.Pow ascending select e;
    var negname = buildNameFromElements(negpow);
    var name = posname;
    if (negname.length > 0) {
        if (name.length == 0) {
            name += "1";
        }
        name += "/" + negname;
    }
    return name;
}
exports.buildDerivedName = buildDerivedName;
function buildNameFromElements(elements) {
    var name = "";
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var e = elements_1[_i];
        name += Unit.getName(e.unit);
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
exports.buildNameFromElements = buildNameFromElements;
/// Needed for reflection since we don't have wildcard generic types like in Java
function getElements(unit) {
    return unit.elements;
}
exports.getElements = getElements;
//# sourceMappingURL=product_unit.js.map
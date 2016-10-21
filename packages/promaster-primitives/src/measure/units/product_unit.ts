import {Quantity} from "../quantity";
import * as UnitConverter from "../unit_converters/unit_converter";
import * as Unit from "../unit";
import {Element, create as createElement} from "./element";

export interface ProductUnit<T extends Quantity> {
	readonly type: "product",
	/// Holds the units composing this product unit.
	//readonly elements: Array<Element>,
}


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
export function create<T extends Quantity>(quantity: T, elements: Array<Element>): Unit.Unit<T> {

	return Unit.create(quantity, elements, {type: "product"} as ProductUnit<T>);

	// // The super-class contructor adds elements but we cannot have any in the ONE instace because
	// // If an element in the list contains a ProductUnit it will causes stack overflow in hashCode
	// // becuase ProductUnit hashCode calls the elements hashcode which in turn calls back to the ProductUnit's hashCode!!!!!
	// return {
	// 	quantity,
	// 	// Init elements to standard, some other constructors can override this by re-setting _elements
	// 	elements: elements,
	// }
}

/// Product unit constructor.
/// <param name="elements">the product elements.</param>
export function fromElements<T extends Quantity>(quantity: T, elements: Array<Element>): Unit.Unit<T> {
	let newProductUnit = create<T>(quantity, elements);
	//newProductUnit._elements.clear();
	//newProductUnit._elements.addAll(elements);
	return newProductUnit;
}

/// Creates the unit defined from the product of the specifed elements.
/// <param name="leftElems">left multiplicand elements</param>
/// <param name="rightElems">right multiplicand elements.</param>
export function fromProduct<T extends Quantity>(quantity: T, leftElems: Array<Element>, rightElems: Array<Element>): Unit.Unit<T> {
	// If we have several elements of the same unit then we can merge them by summing their power
	let allElements: Array<Element> = [];
	allElements.push(...leftElems);
	allElements.push(...rightElems);
	let resultElements: Array<Element> = [];


//      var unitGroups = allElements.GroupBy(e => e.Unit);
	let unitGroups: Map<Unit.Unit<any>, Array<Element>> = new Map<Unit.Unit<any>, Array<Element>>();
	//allElements.forEach((v:Element) => unitGroups.putIfAbsent(v._unit, () => <Element>[]).add(v));
	allElements.forEach((v: Element) => {
		const group = unitGroups.get(v.unit);
		if (group === undefined)
			unitGroups.set(v.unit, [v]);
		else
			group.push(v);
	});


	unitGroups.forEach((unitGroup: Array<Element>, unit: Unit.Unit<any>)=> {

//      for (var unitGroup in unitGroups.values)
//      {
		//var sumpow = unitGroup.sum(e => e.Pow);
		let sumpow: number = unitGroup.reduce((prev: number, element: Element) => prev + element.pow, 0);
		if (sumpow != 0) {
			resultElements.push(createElement(unit, sumpow));
		}
//      }

	});

	//this._elements = resultElements;
	return create(quantity, resultElements);
}

/// <summary>
/// Returns the product of the specified units.
/// </summary>
/// <param name="left">the left unit operand.</param>
/// <param name="right">the right unit operand.</param>
/// <returns>left * right</returns>
export function Product<T extends Quantity>(quantity: T, left: Unit.Unit<any>, right: Unit.Unit<any>): Unit.Unit<T> {
	let leftelements = left.elements;
	let rightelements = right.elements;
	return fromProduct<T>(quantity, leftelements, rightelements);
}

/// Returns the quotient of the specified units.
/// <param name="left">the dividend unit operand.</param>
/// <param name="right">right the divisor unit operand.</param>
/// <returns>dividend / divisor</returns>
export function Quotient<T extends Quantity>(quantity: T, left: Unit.Unit<any>, right: Unit.Unit<any>): Unit.Unit<T> {

	let leftelements = left.elements;
	let invertedRightelements: Array<Element> = [];
	for (let element of right.elements) {
		invertedRightelements.push(createElement(element.unit, -element.pow));
	}
	return fromProduct<T>(quantity, leftelements, invertedRightelements);

}

// Implements abstract method.
export function getStandardUnit<T extends Quantity>(quantity: T, unit: Unit.Unit<T>): Unit.Unit<any> {

	let standardelements: Array<Element> = [];
	for (let e of unit.elements) {
		let newstandardunit: Unit.Unit<any> = Unit.getStandardUnit(e.unit);
		standardelements.push(createElement(newstandardunit, e.pow));
	}
	return fromElements<T>(quantity, standardelements);
}


// Implements abstract method.
export function toStandardUnit<T extends Quantity>(unit: Unit.Unit<T>): UnitConverter.UnitConverter {
	var converter = UnitConverter.Identity;
	for (let element of unit.elements) {
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

export function buildDerivedName<T extends Quantity>(unit: Unit.Unit<T>): string {
//      var pospow = from e in _elements where e.Pow > 0 orderby e.Pow descending select e;
//      var posname = BuildNameFromElements(pospow);
//      var negpow = from e in _elements where e.Pow < 0 orderby e.Pow ascending select e;
//      var negname = BuildNameFromElements(negpow);

	let comparePow = (a: Element, b: Element) => {
		if (a.pow > b.pow)
			return 1;
		else if (a.pow < b.pow)
			return -1;
		else
			return 0;
	};

	var pospow = unit.elements.filter((e) => e.pow > 0);
	pospow.sort(comparePow); // orderby e.Pow descending select e;
	var posname = buildNameFromElements(pospow);
	var negpow = unit.elements.filter((e) => e.pow < 0);
	negpow.sort(comparePow); // orderby e.Pow ascending select e;
	var negname = buildNameFromElements(negpow);

	let name: string = posname;
	if (negname.length > 0) {
		if (name.length == 0) {
			name += "1";
		}

		name += "/" + negname;
	}

	return name;
}

export function buildNameFromElements(elements: Array<Element>): string {
	let name: string = "";
	for (let e of elements) {
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

/// Needed for reflection since we don't have wildcard generic types like in Java
export function getElements<T extends Quantity>(unit: Unit.Unit<T>): Array<Element> {
	return unit.elements
}

